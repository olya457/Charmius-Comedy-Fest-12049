import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { ArrowRight } from '../components/Icons';
import { images } from '../data/images';
import { colors, styles as s } from '../theme';
import { Button } from '../components/UI';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useStore } from '../storage/AppStore';
const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden;height:100%}body{display:flex;align-items:center;justify-content:center}.shape{width:128px;height:128px;border-radius:34px;background:linear-gradient(135deg,#14ebee,#8e70ff,#e300ff);animation:spin 4s ease-in-out forwards;box-shadow:0 0 25px #826aff44}.glass{position:absolute;width:126px;height:126px;border-radius:30px;background:#ffffff25;border:2px solid #ffffff66}@media(prefers-reduced-motion:reduce){.shape{animation-name:still}}@keyframes still{from{opacity:.8}to{opacity:1}}@keyframes spin{0%{transform:rotate(0deg) scale(.7)}50%{transform:rotate(225deg) scale(1)}100%{transform:rotate(405deg) scale(.85)}}</style></head><body><div class="shape"></div><div class="glass"></div><script>document.querySelector('.shape').addEventListener('animationend',()=>window.ReactNativeWebView.postMessage('done'));</script></body></html>`;
export function Loader({ onDone }: { onDone: () => void }) {
  const done = useRef(false);
  const finish = () => {
    if (!done.current) {
      done.current = true;
      onDone();
    }
  };
  return (
    <ImageBackground source={images['festival-backdrop']} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 60,
        }}
      >
        <Image
          source={images['brand-logo']}
          resizeMode="contain"
          style={{ width: '96%', height: 200, maxWidth: 440 }}
        />
        <Text
          style={{
            color: 'white',
            letterSpacing: 7,
            fontWeight: '800',
            marginTop: 22,
            fontSize: 13,
          }}
        >
          COMEDY FEST
        </Text>
      </View>
      <View style={{ height: '27%', minHeight: 170, marginBottom: 24 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          scrollEnabled={false}
          onMessage={finish}
          onError={finish}
          style={{ backgroundColor: 'transparent' }}
          opaque={false}
        />
      </View>
    </ImageBackground>
  );
}
const slides = [
  {
    image: 'onboarding-stand-up',
    title: 'Your Festival of Laughter Starts Here',
    description:
      'Explore stand-up performances, comedy shows, talented entertainers, and everything happening across the festival.',
  },
  {
    image: 'onboarding-performer',
    title: 'Every Show Has a Story',
    description:
      'Browse the festival schedule, discover fascinating comedy facts, and anonymously vote for your favorite performances.',
  },
  {
    image: 'onboarding-festival',
    title: 'More Than Just a Show',
    description:
      'Enjoy festival food, take on creative comedy challenges, and turn memorable moments into your own festival experience.',
  },
];
export function Onboarding() {
  const [page, setPage] = useState(0);
  const [saving, setSaving] = useState(false);
  const { update } = useStore();
  const { height, wide, landscape, compact, padding } = useLayout();
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    opacity.setValue(reduced ? 1 : 0.4);
    Animated.timing(opacity, {
      toValue: 1,
      duration: reduced ? 0 : 300,
      useNativeDriver: true,
    }).start();
  }, [page, opacity, reduced]);
  const finish = async () => {
    setSaving(true);
    await update(v => ({ ...v, onboarded: true }));
    setSaving(false);
  };
  const slide = slides[page];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Animated.Image
        source={images[slide.image]}
        style={[
          StyleSheet.absoluteFill,
          { width: wide ? '52%' : '100%', height: '100%', opacity },
        ]}
        resizeMode="cover"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            width: wide ? '48%' : '100%',
            alignSelf: wide ? 'flex-end' : 'center',
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            padding,
            paddingTop: wide
              ? 40
              : landscape
              ? 80
              : Math.max(160, height * 0.44),
            gap: 20,
          }}
        >
          <Text
            style={[
              s.title,
              { fontSize: compact ? 28 : 34, lineHeight: compact ? 32 : 38 },
            ]}
          >
            {slide.title}
          </Text>
          <Text style={s.body}>{slide.description}</Text>
        </ScrollView>
        <View
          style={{
            flexShrink: 0,
            paddingHorizontal: padding,
            paddingTop: 12,
            paddingBottom: 16,
            gap: 20,
            width: wide ? '48%' : '100%',
            alignSelf: wide ? 'flex-end' : 'center',
          }}
        >
          {page === 2 ? (
            <>
              <View style={{ alignItems: 'center' }}>
                <Dots page={page} />
              </View>
              <Button title="Get Started" disabled={saving} onPress={finish} />
            </>
          ) : (
            <View
              style={[
                s.between,
                {
                  padding: 8,
                  paddingLeft: 24,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 40,
                  backgroundColor: '#ffffff15',
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                onPress={finish}
                disabled={saving}
              >
                <Text style={s.label}>Skip</Text>
              </Pressable>
              <Dots page={page} />
              <Pressable
                accessibilityLabel="Next onboarding page"
                onPress={() => setPage(page + 1)}
                style={[
                  s.circle,
                  {
                    backgroundColor: 'white',
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                  },
                ]}
              >
                <ArrowRight color={colors.bg} />
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
function Dots({ page }: { page: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {slides.map((_, i) => (
        <View
          key={i}
          style={{
            height: 6,
            width: i === page ? 24 : 6,
            borderRadius: 3,
            backgroundColor: i === page ? 'white' : '#ffffff55',
          }}
        />
      ))}
    </View>
  );
}
