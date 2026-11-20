import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
export type Submission = {
  fields: Record<string, string>;
  photo?: string;
  rating?: number;
  savedAt: string;
};
export type Message = { id: string; role: 'user' | 'assistant'; text: string };
export type SavedState = {
  resourceBookmarks: string[];
  onboarded: boolean;
  favorites: string[];
  votes: Record<string, string>;
  submissions: Record<string, Submission>;
  bestScore: number;
  messages: Message[];
};
export const initialState: SavedState = {
  resourceBookmarks: [],
  onboarded: false,
  favorites: [],
  votes: {},
  submissions: {},
  bestScore: 0,
  messages: [],
};
const key = '@charmius/state/v1';
type Store = {
  state: SavedState;
  ready: boolean;
  error: boolean;
  reload: () => void;
  update: (fn: (value: SavedState) => SavedState) => Promise<boolean>;
};
const Context = createContext<Store | null>(null);
export function AppStore({ children }: PropsWithChildren) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const current = useRef(state);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const reload = () => {
    setError(false);
    AsyncStorage.getItem(key)
      .then(raw => {
        const saved = raw ? JSON.parse(raw) : initialState;
        if (
          !saved ||
          typeof saved !== 'object' ||
          !Array.isArray(saved.favorites) ||
          !Array.isArray(saved.messages) ||
          (saved.resourceBookmarks !== undefined &&
            !Array.isArray(saved.resourceBookmarks)) ||
          typeof saved.submissions !== 'object' ||
          typeof saved.votes !== 'object'
        ) {
          throw Error('Invalid data');
        }
        current.current = { ...initialState, ...saved };
        setState(current.current);
        setReady(true);
      })
      .catch(() => setError(true));
  };
  useEffect(() => {
    reload();
  }, []);
  const update = (fn: (value: SavedState) => SavedState): Promise<boolean> => {
    const work = queue.current.then(async () => {
      try {
        const next = fn(current.current);
        await AsyncStorage.setItem(key, JSON.stringify(next));
        current.current = next;
        setState(next);
        return true;
      } catch {
        Alert.alert(
          'Could not save',
          'Your changes were not saved. Please check your device storage and try again.',
        );
        return false;
      }
    });
    queue.current = work;
    return work;
  };
  return (
    <Context.Provider value={{ state, ready, error, reload, update }}>
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const value = useContext(Context);
  if (!value) {
    throw Error('AppStore is required');
  }
  return value;
}
