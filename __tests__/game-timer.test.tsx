import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text, Modal } from 'react-native';
import { Game } from '../src/screens/Game';
import { ScreenProps } from '../src/navigation/types';
jest.mock('@react-navigation/native', () => ({ usePreventRemove: jest.fn() }));
jest.mock('../src/components/Icons', () => ({
  Pause: () => null,
  Timer: () => null,
  Trophy: () => null,
  Minus: () => null,
  Plus: () => null,
}));
jest.mock('../src/storage/AppStore', () => ({
  useStore: () => ({
    state: { bestScore: 0 },
    update: jest.fn().mockResolvedValue(true),
  }),
}));
jest.mock('../src/components/UI', () => {
  const ReactModule = require('react');
  const RN = require('react-native');
  const Container = ({ children }: { children: React.ReactNode }) =>
    ReactModule.createElement(RN.View, null, children);
  const Button = ({
    title,
    onPress,
    disabled,
  }: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
  }) =>
    ReactModule.createElement(
      RN.Pressable,
      { onPress, disabled, accessibilityLabel: title },
      ReactModule.createElement(RN.Text, null, title),
    );
  return {
    Screen: Container,
    Card: Container,
    Back: () => null,
    Progress: () => null,
    Button,
    IconButton: ({ label, onPress }: { label: string; onPress: () => void }) =>
      ReactModule.createElement(Button, { title: label, onPress }),
    Chips: ({
      items,
      onChange,
    }: {
      items: string[];
      onChange: (v: string) => void;
    }) =>
      ReactModule.createElement(
        RN.View,
        null,
        items.map(item =>
          ReactModule.createElement(Button, {
            key: item,
            title: item,
            onPress: () => onChange(item),
          }),
        ),
      ),
  };
});
let root: TestRenderer.ReactTestRenderer;
const props = {
  navigation: { goBack: jest.fn(), dispatch: jest.fn() },
  route: { key: 'game', name: 'Game' },
} as unknown as ScreenProps<'Game'>;
const press = async (label: string) => {
  await act(async () => {
    root.root
      .findAll(
        node =>
          node.props.accessibilityLabel === label &&
          typeof node.props.onPress === 'function',
      )[0]
      .props.onPress();
  });
};
const text = () =>
  root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat()
    .join(' ')
    .replace(/\s+/g, ' ');
beforeEach(() => jest.useFakeTimers());
afterEach(async () => {
  await act(async () => root.unmount());
  jest.useRealTimers();
});
test('timer pauses, resumes and submits an unanswered round exactly once', async () => {
  await act(async () => {
    root = TestRenderer.create(<Game {...props} />);
  });
  await press('15s');
  await press('Start Challenge');
  await act(async () => jest.advanceTimersByTime(5100));
  expect(text()).toContain('0:10');
  await press('Pause challenge');
  expect(root.root.findByType(Modal).props.visible).toBe(true);
  await act(async () => jest.advanceTimersByTime(30000));
  expect(text()).toContain('0:10');
  await press('Resume');
  await act(async () => jest.advanceTimersByTime(11000));
  expect(text()).toContain('Here’s how you did:');
  expect(text()).toContain('0 of 3 correct.');
  await press('Next Question');
  expect(text()).toContain('0:15');
  expect(text()).toContain('Tap a definition');
}, 60000);
