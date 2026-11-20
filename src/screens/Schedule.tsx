import { GradientSurface } from '../components/GradientSurface';
import { useLayout } from '../hooks/useLayout';
import { ResponsiveGrid } from '../components/ResponsiveGrid';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Share,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Heart,
  Share2,
  MapPin,
  Check,
  EyeOff,
  Vote,
} from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { shows, Show } from '../data';
import { imageFor } from '../data/images';
import { colors, gradient, styles as s } from '../theme';
import {
  Screen,
  Card,
  Button,
  Chips,
  Empty,
  Badge,
  Progress,
  Back,
  IconButton,
} from '../components/UI';
import { useStore } from '../storage/AppStore';
import { RootParams, ScreenProps } from '../navigation/types';
import {
  showStatus,
  formatSaved,
  localDateKey,
  formatShowDate,
  formatMonth,
} from '../utils/dates';
export function Favorite({ id }: { id: string }) {
  const { state, update } = useStore();
  const active = state.favorites.includes(id);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityState={{ selected: active }}
      hitSlop={8}
      onPress={() =>
        update(v => ({
          ...v,
          favorites: v.favorites.includes(id)
            ? v.favorites.filter(x => x !== id)
            : [...v.favorites, id],
        }))
      }
    >
      <Heart
        size={20}
        color={active ? colors.pink : colors.dim}
        fill={active ? colors.pink : 'transparent'}
      />
    </Pressable>
  );
}
export function ShowCard({ show }: { show: Show }) {
  const { compact } = useLayout();
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const status = showStatus(show);
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ width: 45, paddingTop: 10 }}>
        <Text style={s.label}>{show.time.split(' – ')[0]}</Text>
        <Text style={s.small}>{show.time.split(' – ')[1]}</Text>
      </View>
      <View
        style={[
          s.card,
          {
            flex: 1,
            padding: 10,
            borderRadius: 25,
            flexDirection: 'row',
            gap: 12,
          },
        ]}
      >
        <Pressable
          accessibilityLabel={`View ${show.title}`}
          onPress={() => navigation.navigate('Show', { id: show.id })}
        >
          <Image
            source={imageFor(show.title)}
            style={{ width: compact ? 56 : 72, height: 110, borderRadius: 16 }}
          />
        </Pressable>
        <View style={{ flex: 1, gap: 8 }}>
          <View style={s.between}>
            <Text
              style={[
                s.small,
                {
                  color: status === 'Performed' ? colors.dim : colors.green,
                  flex: 1,
                },
              ]}
            >
              {status}
            </Text>
            <Favorite id={show.id} />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Show', { id: show.id })}
          >
            <Text style={[s.label, { fontWeight: '800', fontSize: 16 }]}>
              {show.title}
            </Text>
          </Pressable>
          <View style={s.row}>
            <MapPin size={13} color={colors.muted} />
            <Text style={s.small}>{show.stage}</Text>
          </View>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Progress value={show.duration / 120} />
            </View>
            <Text style={[s.small, { fontSize: 10 }]}>{show.duration} min</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
export function Schedule() {
  const { state } = useStore();
  const dates = [...new Set(shows.map(x => x.dateKey))];
  const [day, setDay] = useState(
    dates.find(x => x >= localDateKey()) || dates[0],
  );
  const months = [...new Set(dates.map(date => date.slice(0, 7)))];
  const month = day.slice(0, 7);
  const monthDates = dates.filter(date => date.startsWith(month));
  const [filter, setFilter] = useState('All stages');
  const favorites = `Favorites · ${state.favorites.length}`;
  const list = shows.filter(
    x =>
      x.dateKey === day &&
      (filter === 'All stages' ||
        (filter === 'Favorites' && state.favorites.includes(x.id)) ||
        x.stage === filter),
  );
  return (
    <Screen>
      <Text style={s.title}>Festival Schedule</Text>
      <Text style={s.small}>
        Monthly performances · {formatMonth(months[0])} –{' '}
        {formatMonth(months[months.length - 1])}
      </Text>
      <Chips
        items={months.map(formatMonth)}
        value={formatMonth(month)}
        onChange={label => {
          const target = months.find(value => formatMonth(value) === label)!;
          const available = dates.filter(date => date.startsWith(target));
          setDay(
            available.find(date => date >= localDateKey()) || available[0],
          );
        }}
      />
      <ScrollView
        key={month}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {monthDates.map(date => {
          const show = shows.find(x => x.dateKey === date)!;
          const selected = day === date;
          return (
            <Pressable
              key={date}
              onPress={() => setDay(date)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <GradientSurface
                colors={selected ? gradient : ['#ffffff08', '#ffffff08']}
                style={{
                  width: 66,
                  paddingVertical: 12,
                  alignItems: 'center',
                  gap: 4,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={[s.small, { fontWeight: '700', color: colors.text }]}
                >
                  {show.date.slice(0, 3).toUpperCase()}
                </Text>
                <Text style={[s.heading, { fontSize: 24 }]}>
                  {Number(date.slice(-2))}
                </Text>
                <Text style={[s.small, { fontSize: 10 }]}>
                  {formatMonth(date).split(' ')[0].toUpperCase()} ·{' '}
                  {shows.filter(x => x.dateKey === date).length}
                </Text>
              </GradientSurface>
            </Pressable>
          );
        })}
      </ScrollView>
      <Chips
        items={['All stages', favorites, ...new Set(shows.map(x => x.stage))]}
        value={filter === 'Favorites' ? favorites : filter}
        onChange={v => setFilter(v === favorites ? 'Favorites' : v)}
      />
      {list.length ? (
        <ResponsiveGrid minimum={330} maximum={2}>
          {list.map(show => (
            <ShowCard key={show.id} show={show} />
          ))}
        </ResponsiveGrid>
      ) : (
        <Empty
          title={
            filter === 'Favorites'
              ? 'No favorites on this day'
              : 'No shows on this stage today'
          }
          description="Try another day or stage. Tap a heart to save a show."
        />
      )}
    </Screen>
  );
}
export function ShowDetail({ route }: ScreenProps<'Show'>) {
  const { padding, heroHeight } = useLayout();
  const show = shows.find(x => x.id === route.params.id)!;
  const { state, update } = useStore();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const voted = state.votes[show.id];
  return (
    <Screen bottom={40}>
      <View style={{ marginHorizontal: -padding, marginTop: -padding }}>
        <Image
          source={imageFor(show.title)}
          style={{ width: '100%', height: heroHeight }}
        />
        <LinearGradient
          colors={['transparent', colors.bg]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 160,
          }}
        />
        <View style={{ position: 'absolute', top: 18, left: 20, right: 20 }}>
          <Back
            right={
              <View style={s.row}>
                <IconButton
                  label="Share performance"
                  onPress={() =>
                    Share.share({
                      message: `${show.title}\n${formatShowDate(show)} · ${
                        show.time
                      }\n${show.stage}\n${show.description}`,
                    }).catch(() => {})
                  }
                >
                  <Share2 color={colors.text} size={20} />
                </IconButton>
                <Favorite id={show.id} />
              </View>
            }
          />
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: -88, gap: 12 }}>
          <View style={s.wrap}>
            <Badge text={show.category} />
            <Badge text={show.age} color={colors.text} />
            <Badge text={showStatus(show)} color={colors.green} />
          </View>
          <Text style={[s.title, { fontSize: 36, lineHeight: 39 }]}>
            {show.title}
          </Text>
        </View>
      </View>
      <ResponsiveGrid minimum={145} maximum={4}>
        {[
          ['Date', formatShowDate(show)],
          ['Time', show.time],
          ['Duration', `${show.duration} minutes`],
          ['Stage', show.stage],
        ].map(([label, value]) => (
          <Card key={label} style={{ padding: 15, borderRadius: 20, gap: 8 }}>
            <Text style={s.small}>{label}</Text>
            <Text style={s.label}>{value}</Text>
          </Card>
        ))}
      </ResponsiveGrid>
      <Text style={s.body}>{show.description}</Text>
      <Card
        style={{
          borderColor: voted ? '#227766' : '#76215e',
          backgroundColor: voted ? '#0b1e2a' : '#17122f',
        }}
      >
        <View style={s.between}>
          <Text style={s.eyebrow}>AUDIENCE CHOICE</Text>
          <Badge
            text={voted ? 'Vote saved' : 'Voting open'}
            color={voted ? colors.green : colors.pink}
          />
        </View>
        {voted ? (
          <>
            <Check size={42} color={colors.green} />
            <Text style={s.heading}>Your vote is in</Text>
            <Text style={s.small}>
              Saved on this device · {formatSaved(voted)}
            </Text>
          </>
        ) : (
          <>
            <Text style={s.heading}>Loved this show? Make it count.</Text>
            <Text style={s.body}>
              Support your favorite performance, before or after it plays.
            </Text>
          </>
        )}
        <View style={s.row}>
          <EyeOff size={15} color={colors.muted} />
          <Text style={s.small}>
            Anonymous · One vote per show on this device
          </Text>
        </View>
        <Button
          title={voted ? 'Voted — thank you!' : '♡  Vote for This Show'}
          disabled={!!voted}
          onPress={() => setConfirm(true)}
        />
        <Text style={[s.small, { textAlign: 'center' }]}>
          You’ve voted for {Object.keys(state.votes).length} of {shows.length}{' '}
          shows
        </Text>
      </Card>
      <Text style={s.heading}>Good to know</Text>
      <Text style={s.body}>
        Check the age recommendation before attending. Allow enough time to move
        between stages. Ask festival staff about access and late entry.
      </Text>
      <Modal
        visible={confirm}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirm(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            justifyContent: 'flex-end',
          }}
        >
          <ScrollView
            style={{
              maxHeight: '90%',
              width: '100%',
              maxWidth: 620,
              alignSelf: 'center',
              flexGrow: 0,
            }}
            contentContainerStyle={[
              s.card,
              {
                backgroundColor: '#151e53',
                padding: 24,
                paddingBottom: 40,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}
          >
            <Vote size={36} color={colors.pink} />
            <Text style={s.heading}>Vote for “{show.title}”?</Text>
            <Text style={s.body}>
              Your anonymous vote will be saved on this device. It counts once
              and cannot be changed after confirmation.
            </Text>
            <Button
              title="Confirm Vote"
              disabled={busy}
              onPress={async () => {
                setBusy(true);
                const ok = await update(v => ({
                  ...v,
                  votes: {
                    ...v.votes,
                    [show.id]: v.votes[show.id] || new Date().toISOString(),
                  },
                }));
                setBusy(false);
                if (ok) {
                  setConfirm(false);
                }
              }}
            />
            <Button
              secondary
              title="Cancel"
              onPress={() => setConfirm(false)}
              disabled={busy}
            />
          </ScrollView>
        </View>
      </Modal>
    </Screen>
  );
}
