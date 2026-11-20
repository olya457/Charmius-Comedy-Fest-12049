import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
export type TabParams = {
  Home: undefined;
  Schedule: undefined;
  Discover: undefined;
  Food: undefined;
  Challenges: undefined;
};
export type RootParams = {
  Main: NavigatorScreenParams<TabParams>;
  Resource: { id: string };
  Show: { id: string };
  Dish: { id: string };
  Challenge: { id: string };
  Game: undefined;
  Assistant: undefined;
  FAQ: undefined;
};
export type ScreenProps<T extends keyof RootParams> = NativeStackScreenProps<
  RootParams,
  T
>;
