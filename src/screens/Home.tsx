import { GradientSurface } from '../components/GradientSurface';
import { ResponsiveGrid } from '../components/ResponsiveGrid';
import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Info,
  Accessibility,
  Utensils,
  Users,
  Wifi,
  Cross,
  ParkingCircle,
  Bus,
  Search,
  Shirt,
  Droplets,
  BatteryCharging,
  Store,
  Armchair,
  Headphones,
  CircleHelp,
} from '../components/Icons';
import { Screen, Card, Button, Badge, IconButton } from '../components/UI';
import { colors, styles as s } from '../theme';
import { shows } from '../data';
import { services } from '../data/help';
import { images, imageFor } from '../data/images';
import { RootParams } from '../navigation/types';
import { showStart } from '../utils/dates';
const icons = [
  Info,
  Accessibility,
  Utensils,
  Users,
  Wifi,
  Cross,
  ParkingCircle,
  Bus,
  Search,
  Shirt,
  Droplets,
  BatteryCharging,
  Store,
  Armchair,
];
export function Home() {
  const nav = useNavigation<NativeStackNavigationProp<RootParams>>();
  const upcoming = shows
    .filter(x => showStart(x).getTime() > Date.now())
    .slice(0, 5);
  const hour = new Date().getHours();
  return (
    <Screen>
      <View style={s.between}>
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={s.small}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text style={s.heading}>
            Good {hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'}!
          </Text>
        </View>
        <IconButton
          label="Festival questions"
          onPress={() => nav.navigate('FAQ')}
        >
          <CircleHelp color={colors.text} size={22} />
        </IconButton>
      </View>
      <View
        style={{
          borderRadius: 30,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#303c73',
          backgroundColor: '#111747',
        }}
      >
        <ImageBackground
          source={images['festival-backdrop']}
          style={{ height: 230, justifyContent: 'center', padding: 16 }}
          imageStyle={{ opacity: 0.7 }}
        >
          <LinearGradient
            colors={['#286eff77', 'transparent', '#111747']}
            style={{ position: 'absolute', inset: 0 }}
          />
          <Badge text="A celebration of live comedy" color={colors.cyan} />
          <Image
            source={images['brand-logo']}
            style={{ width: '100%', height: 165 }}
            resizeMode="contain"
          />
        </ImageBackground>
        <View style={{ padding: 22, gap: 16 }}>
          <Text style={[s.title, { fontSize: 28, lineHeight: 30 }]}>
            Charmius Comedy Fest
          </Text>
          <Text style={s.body}>
            Charmius Comedy Fest brings together stand-up comedians, theatrical
            performances, improvisation shows, and interactive entertainment in
            a lively celebration of humor. Discover talented performers, enjoy
            unexpected comedy moments, and experience a festival filled with
            laughter, creativity, and unforgettable live performances.
          </Text>
          <Button
            title="Explore the Schedule  →"
            onPress={() => nav.navigate('Main', { screen: 'Schedule' })}
          />
        </View>
      </View>
      <View style={s.between}>
        <Text style={s.heading}>Up next at the festival</Text>
        <Pressable onPress={() => nav.navigate('Main', { screen: 'Schedule' })}>
          <Text style={{ color: colors.cyan }}>See all</Text>
        </Pressable>
      </View>
      {upcoming.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {upcoming.map(show => (
            <Pressable
              key={show.id}
              accessibilityRole="button"
              onPress={() => nav.navigate('Show', { id: show.id })}
            >
              <ImageBackground
                source={imageFor(show.title)}
                style={{
                  width: 210,
                  height: 175,
                  justifyContent: 'space-between',
                  padding: 15,
                }}
                imageStyle={{ borderRadius: 24 }}
              >
                <LinearGradient
                  colors={['#00000022', 'transparent', '#070a20ee']}
                  style={{ position: 'absolute', inset: 0, borderRadius: 24 }}
                />
                <Text style={[s.small, { color: 'white' }]}>
                  {show.date}, {show.dateKey.slice(0, 4)} ·{' '}
                  {show.time.split(' – ')[0]}
                </Text>
                <Text style={[s.heading, { fontSize: 18 }]}>{show.title}</Text>
              </ImageBackground>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <Text style={s.body}>
          All scheduled performances have finished. Explore the schedule to
          revisit the lineup.
        </Text>
      )}
      <Card>
        <Text style={s.eyebrow}>ABOUT THE FESTIVAL</Text>
        <Text style={s.heading}>Our Story: Where Laughter Began</Text>
        <Text style={s.body}>
          Charmius Comedy Fest brings people together through laughter. Explore
          stand-up, improvisation, and theatrical comedy in a welcoming
          celebration of different voices and styles of humor.
        </Text>
        <View style={s.separator} />
        <View style={{ flexDirection: 'row', gap: 50 }}>
          <View>
            <Text style={[s.title, { color: colors.cyan }]}>
              {shows.length}
            </Text>
            <Text style={s.small}>shows</Text>
          </View>
          <View>
            <Text style={[s.title, { color: colors.pink }]}>
              {new Set(shows.map(x => x.stage)).size}
            </Text>
            <Text style={s.small}>stages</Text>
          </View>
        </View>
      </Card>
      <Text style={s.heading}>Festival services</Text>
      <ResponsiveGrid minimum={160} maximum={4}>
        {services.map((service, i) => {
          const Icon = icons[i];
          return (
            <Card
              key={service.title}
              style={{
                padding: 15,
                gap: 10,
                borderRadius: 22,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  backgroundColor: service.color + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon color={service.color} size={22} />
              </View>
              <Text style={s.label}>{service.title}</Text>
              <Text style={s.small}>{service.description}</Text>
            </Card>
          );
        })}
      </ResponsiveGrid>
      <GradientSurface
        colors={['#273d8d', '#4a235d', '#151b57']}
        style={[s.card, { padding: 24 }]}
      >
        <Headphones color="white" size={30} />
        <Text style={s.title}>Need a Little Help?</Text>
        <Text style={s.body}>
          Get quick answers about show times, stages, food, Wi-Fi, accessibility
          and festival rules.
        </Text>
        <Button
          title="Ask the Assistant"
          onPress={() => nav.navigate('Assistant')}
        />
        <Button
          secondary
          title="Frequently Asked Questions"
          onPress={() => nav.navigate('FAQ')}
        />
      </GradientSurface>
    </Screen>
  );
}
