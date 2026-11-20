import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { AppStore, useStore, initialState } from '../src/storage/AppStore';
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
let store: ReturnType<typeof useStore>;
function Probe() {
  store = useStore();
  return null;
}
let root: TestRenderer.ReactTestRenderer;
beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});
afterEach(async () => {
  await act(async () => root?.unmount());
});
async function mount() {
  await act(async () => {
    root = TestRenderer.create(
      <AppStore>
        <Probe />
      </AppStore>,
    );
  });
}
test('new installs have no seeded user data', async () => {
  await mount();
  expect(store.ready).toBe(true);
  expect(store.state).toEqual(initialState);
});
test('concurrent updates do not lose favorites or votes and survive remount', async () => {
  await mount();
  await act(async () => {
    await Promise.all([
      store.update(v => ({ ...v, favorites: [...v.favorites, '1'] })),
      store.update(v => ({
        ...v,
        votes: { ...v.votes, '2': '2026-11-18T10:00:00Z' },
      })),
    ]);
  });
  const raw = (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1];
  expect(JSON.parse(raw).favorites).toEqual(['1']);
  expect(JSON.parse(raw).votes['2']).toBeDefined();
  await act(async () => root.unmount());
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(raw);
  await mount();
  expect(store.state.favorites).toEqual(['1']);
  expect(store.state.votes['2']).toBeDefined();
});
test('failed storage writes preserve the last saved state', async () => {
  await mount();
  (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(Error('Disk full'));
  await act(async () => {
    expect(await store.update(v => ({ ...v, bestScore: 500 }))).toBe(false);
  });
  expect(store.state.bestScore).toBe(0);
  expect(Alert.alert).toHaveBeenCalled();
});
test('invalid stored data is not overwritten', async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{broken');
  await mount();
  expect(store.error).toBe(true);
  expect(store.ready).toBe(false);
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
});

test('existing users gain empty bookmarks without losing saved content', async () => {
  const legacy = {
    ...initialState,
    favorites: ['1'],
    bestScore: 700,
  } as Partial<typeof initialState>;
  delete legacy.resourceBookmarks;
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(legacy));
  await mount();
  expect(store.state.resourceBookmarks).toEqual([]);
  expect(store.state.favorites).toEqual(['1']);
  await act(async () => {
    await store.update(v => ({ ...v, resourceBookmarks: ['joke-writing'] }));
  });
  const raw = (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1];
  expect(JSON.parse(raw).resourceBookmarks).toEqual(['joke-writing']);
  expect(JSON.parse(raw).bestScore).toBe(700);
});
