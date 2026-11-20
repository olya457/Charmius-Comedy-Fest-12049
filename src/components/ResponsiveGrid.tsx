import React, { Children, PropsWithChildren, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { gridMetrics } from '../utils/layout';
export function ResponsiveGrid({
  children,
  minimum = 290,
  maximum = 3,
}: PropsWithChildren<{ minimum?: number; maximum?: number }>) {
  const [width, setWidth] = useState(0);
  const { fontScale } = useWindowDimensions();
  const { itemWidth } = gridMetrics(width, fontScale, minimum, maximum);
  return (
    <View
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'stretch',
      }}
    >
      {Children.toArray(children).map((child, i) => (
        <View
          key={React.isValidElement(child) && child.key ? child.key : i}
          style={{ width: width > 0 ? itemWidth : '100%' }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
