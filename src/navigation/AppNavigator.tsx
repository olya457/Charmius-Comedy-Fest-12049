import { GradientSurface } from '../components/GradientSurface';
import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet, Keyboard, Platform } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  House,
  CalendarDays,
  Compass,
  Utensils,
  Drama,
} from '../components/Icons';
import { RootParams, TabParams } from './types';
import { ResourceDetail } from '../screens/Learning';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Home } from '../screens/Home';
import { Schedule, ShowDetail } from '../screens/Schedule';
import { Food, DishDetail } from '../screens/Food';
import { Discover } from '../screens/Discover';
import { Challenges, ChallengeDetail } from '../screens/Challenges';
import { Game } from '../screens/Game';
import { Assistant, FAQ } from '../screens/Help';
import { colors, gradient } from '../theme';
const Stack = createNativeStackNavigator<RootParams>();
const Tabs = createBottomTabNavigator<TabParams>();
const icons = [House, CalendarDays, Compass, Utensils, Drama];
function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { padding } = useLayout();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  if (keyboardVisible) {
    return null;
  }
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: padding,
        right: padding,
        bottom: Math.max(insets.bottom, 12),
      }}
    >
      <View style={n.bar}>
        {state.routes.map((route, i) => {
          const selected = state.index === i;
          const Icon = icons[i];
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={route.name}
              accessibilityState={{ selected }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!selected && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              style={{ flex: 1, alignItems: 'center' }}
            >
              <GradientSurface
                colors={selected ? gradient : ['transparent', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[n.item, selected && n.glow]}
              >
                <Icon
                  size={23}
                  strokeWidth={2.2}
                  color={selected ? 'white' : '#a6afd2'}
                />
              </GradientSurface>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
function MainTabs() {
  const reduced = useReducedMotion();
  return (
    <Tabs.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        animation: reduced ? 'none' : 'fade',
      }}
    >
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Schedule" component={Schedule} />
      <Tabs.Screen name="Discover" component={Discover} />
      <Tabs.Screen name="Food" component={Food} />
      <Tabs.Screen name="Challenges" component={Challenges} />
    </Tabs.Navigator>
  );
}
export function AppNavigator() {
  const reduced = useReducedMotion();
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.bg,
          card: colors.card,
          primary: colors.pink,
          text: colors.text,
          border: colors.border,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: reduced ? 'none' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Resource" component={ResourceDetail} />
        <Stack.Screen name="Show" component={ShowDetail} />
        <Stack.Screen name="Dish" component={DishDetail} />
        <Stack.Screen name="Challenge" component={ChallengeDetail} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="Assistant" component={Assistant} />
        <Stack.Screen name="FAQ" component={FAQ} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const n = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#414967',
    backgroundColor: '#121936',
    padding: 7,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  item: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    shadowColor: colors.pink,
    shadowOpacity: 0.5,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
});
