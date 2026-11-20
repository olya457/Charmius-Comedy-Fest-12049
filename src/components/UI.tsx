import React, { PropsWithChildren, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, SearchX, X } from './Icons';
import { useNavigation } from '@react-navigation/native';
import { colors, gradient, styles as s } from '../theme';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { StageEntrance, StageLights } from './Motion';
export function Screen({
  children,
  scroll = true,
  tone = 'blue',
  bottom = 100,
}: PropsWithChildren<{
  scroll?: boolean;
  tone?: 'blue' | 'purple';
  bottom?: number;
}>) {
  const layout = useLayout();
  const contentStyle = [
    u.content,
    {
      padding: layout.padding,
      paddingBottom: Math.max(bottom, layout.insets.bottom + 24),
    },
  ];
  return (
    <View style={u.fill}>
      <LinearGradient
        colors={[tone === 'blue' ? '#141d60' : '#30134f', colors.bg, colors.bg]}
        locations={[0, 0.36, 1]}
        style={StyleSheet.absoluteFill}
      />
      <StageLights />
      <StageEntrance>
        <SafeAreaView edges={['top', 'left', 'right']} style={u.fill}>
          <KeyboardAvoidingView
            style={u.fill}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {scroll ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={contentStyle}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={[contentStyle, u.fill]}>{children}</View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </StageEntrance>
    </View>
  );
}
export function Button({
  title,
  onPress,
  disabled,
  secondary,
  danger,
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  danger?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const animatePress = (value: number) => {
    Animated.spring(scale, {
      toValue: reduced ? 1 : value,
      speed: 32,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.View
      style={[{ flexShrink: 0 }, style, { transform: [{ scale }] }]}
    >
      <Pressable
        onPressIn={() => animatePress(0.97)}
        onPressOut={() => animatePress(1)}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          u.button,
          secondary && { borderWidth: 1, borderColor: colors.border },
          { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        ]}
      >
        <LinearGradient
          colors={
            secondary
              ? ['#ffffff0c', '#ffffff0c']
              : danger
              ? ['#742448', '#a42950']
              : gradient
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
        />
        <Text style={[s.label, { textAlign: 'center', flexShrink: 0 }]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
export function Back({ right }: { right?: React.ReactNode }) {
  const nav = useNavigation();
  return (
    <View style={s.between}>
      <IconButton label="Go back" onPress={() => nav.goBack()}>
        <ArrowLeft color={colors.text} size={22} />
      </IconButton>
      {right}
    </View>
  );
}
export function IconButton({
  children,
  onPress,
  label,
}: PropsWithChildren<{ onPress: () => void; label: string }>) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={s.circle}
    >
      {children}
    </Pressable>
  );
}
export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Badge({
  text,
  color = colors.cyan,
}: {
  text: string;
  color?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: color + '18',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color, fontSize: 11, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}
export function Chips({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
      style={{ flexGrow: 0 }}
    >
      {items.map(item => (
        <Pressable
          key={item}
          accessibilityRole="button"
          accessibilityState={{ selected: value === item }}
          onPress={() => onChange(item)}
          style={[u.chip, value === item && { backgroundColor: colors.text }]}
        >
          <Text
            style={{
              color: value === item ? colors.bg : colors.muted,
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <View style={[s.row, s.input, { paddingVertical: 0 }]}>
      <Search size={18} color={colors.dim} />
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={colors.dim}
        value={value}
        onChangeText={onChange}
        style={{
          flex: 1,
          color: colors.text,
          paddingVertical: 15,
          fontSize: 14,
        }}
      />
      {!!value && (
        <Pressable
          accessibilityLabel="Clear search"
          onPress={() => onChange('')}
          hitSlop={10}
        >
          <X size={18} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={u.empty}>
      <SearchX color={colors.cyan} size={32} />
      <Text style={[s.label, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[s.small, { textAlign: 'center' }]}>{description}</Text>
    </View>
  );
}
export function Progress({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: Math.min(1, Math.max(0, value)),
      duration: reduced ? 0 : 450,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [value, reduced, progress]);
  return (
    <View
      style={{
        height: 6,
        backgroundColor: '#ffffff1a',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }}
      >
        <LinearGradient
          colors={[colors.cyan, colors.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 6,
            width: '100%',
          }}
        />
      </Animated.View>
    </View>
  );
}
const u = StyleSheet.create({
  fill: { flex: 1, backgroundColor: 'transparent' },
  content: {
    padding: 20,
    gap: 20,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  button: {
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 32,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: '#ffffff06',
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 26,
    padding: 32,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
