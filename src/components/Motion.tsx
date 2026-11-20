import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useReducedMotion } from '../hooks/useReducedMotion';
export function StageEntrance({ children }: PropsWithChildren) {
  const focused = useIsFocused();
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!focused) {
      return;
    }
    progress.setValue(reduced ? 1 : 0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [focused, reduced, progress]);
  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [18, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
export function StageLights() {
  const focused = useIsFocused();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(AppState.currentState === 'active');
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const sub = AppState.addEventListener('change', state =>
      setActive(state === 'active'),
    );
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (reduced || !focused || !active) {
      drift.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, focused, active, drift]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: 0.32,
          transform: [
            {
              translateX: drift.interpolate({
                inputRange: [0, 1],
                outputRange: [-35, 35],
              }),
            },
            {
              rotate: drift.interpolate({
                inputRange: [0, 1],
                outputRange: ['-8deg', '8deg'],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#7955ff44', '#fc32b618', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.65 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}
