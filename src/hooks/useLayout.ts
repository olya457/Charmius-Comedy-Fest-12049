import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { layoutFor } from '../utils/layout';
export function useLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return {
    ...layoutFor(width, height, insets.left + insets.right),
    width,
    height,
    fontScale,
    insets,
  };
}
