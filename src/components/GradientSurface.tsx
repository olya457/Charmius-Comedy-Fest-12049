import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Point = { x: number; y: number };

type GradientSurfaceProps = PropsWithChildren<{
  colors: string[];
  start?: Point;
  end?: Point;
  style?: StyleProp<ViewStyle>;
}>;

export function GradientSurface({
  children,
  colors,
  start,
  end,
  style,
}: GradientSurfaceProps) {
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <LinearGradient
        pointerEvents="none"
        colors={colors}
        start={start}
        end={end}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
