import { GradientSurface } from '../components/GradientSurface';
import React, { useState } from 'react';
import { View, Text, Pressable, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { resources } from '../data/resources';
import { useStore } from '../storage/AppStore';
import { RootParams, ScreenProps } from '../navigation/types';
import {
  Card,
  Badge,
  Button,
  Screen,
  Back,
  SearchField,
  Chips,
  Empty,
  IconButton,
} from '../components/UI';
import {
  BookOpen,
  Bookmark,
  Play,
  ExternalLink,
  Sparkles,
} from '../components/Icons';
import { ResponsiveGrid } from '../components/ResponsiveGrid';
import { colors, styles as s } from '../theme';
export function LearningLibrary() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const { state, update } = useStore();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All');
  const [topic, setTopic] = useState('All topics');
  const list = resources.filter(
    item =>
      (kind === 'All' ||
        (kind === 'Saved' && state.resourceBookmarks.includes(item.id)) ||
        kind === item.kind) &&
      (topic === 'All topics' || topic === item.topic) &&
      `${item.title} ${item.topic} ${item.source} ${item.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <Text style={s.heading}>Backstage Reading Room</Text>
      <Text style={s.body}>
        English-language articles and videos to inspire your next laugh. Save a
        favorite and try a creative challenge.
      </Text>
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Search articles, videos, topics..."
      />
      <Chips
        items={['All', 'Article', 'Video', 'Saved']}
        value={kind}
        onChange={setKind}
      />
      <Chips
        items={['All topics', ...new Set(resources.map(x => x.topic))]}
        value={topic}
        onChange={setTopic}
      />
      {list.length ? (
        <ResponsiveGrid>
          {list.map(item => {
            const saved = state.resourceBookmarks.includes(item.id);
            const Icon = item.kind === 'Video' ? Play : BookOpen;
            return (
              <Card key={item.id}>
                <View style={s.between}>
                  <Icon
                    color={item.kind === 'Video' ? colors.pink : colors.cyan}
                    size={28}
                  />
                  <IconButton
                    label={saved ? 'Unsave resource' : 'Save resource'}
                    onPress={() =>
                      update(v => ({
                        ...v,
                        resourceBookmarks: v.resourceBookmarks.includes(item.id)
                          ? v.resourceBookmarks.filter(id => id !== item.id)
                          : [...v.resourceBookmarks, item.id],
                      }))
                    }
                  >
                    <Bookmark
                      color={saved ? colors.pink : colors.muted}
                      fill={saved ? colors.pink : 'transparent'}
                      size={20}
                    />
                  </IconButton>
                </View>
                <View style={s.wrap}>
                  <Badge text={item.kind} />
                  <Badge text={item.topic} color="#ae8aff" />
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    navigation.navigate('Resource', { id: item.id })
                  }
                >
                  <Text style={s.heading}>{item.title}</Text>
                </Pressable>
                <Text style={s.body}>{item.description}</Text>
                <Text style={s.small}>{item.source} · English</Text>
                <Button
                  secondary
                  title="Explore resource →"
                  onPress={() =>
                    navigation.navigate('Resource', { id: item.id })
                  }
                />
              </Card>
            );
          })}
        </ResponsiveGrid>
      ) : (
        <Empty
          title={
            kind === 'Saved' ? 'No saved resources match' : 'No resources found'
          }
          description="Try another filter, or bookmark a resource to find it here."
        />
      )}
      <Text style={s.small}>
        Full articles and videos open on their publishers’ websites and require
        an internet connection.
      </Text>
    </>
  );
}
export function ResourceDetail({ route, navigation }: ScreenProps<'Resource'>) {
  const item = resources.find(x => x.id === route.params.id);
  const { state, update } = useStore();
  const [opening, setOpening] = useState(false);
  if (!item) {
    return (
      <Screen bottom={40}>
        <Back />
        <Empty
          title="Resource unavailable"
          description="Return to Discover to choose another resource."
        />
      </Screen>
    );
  }
  const saved = state.resourceBookmarks.includes(item.id);
  const open = async () => {
    setOpening(true);
    try {
      await Linking.openURL(item.url);
    } catch {
      Alert.alert(
        'Could not open the resource',
        'Please check your internet connection and browser, then try again.',
      );
    } finally {
      setOpening(false);
    }
  };
  return (
    <Screen tone="purple" bottom={40}>
      <Back
        right={
          <IconButton
            label={saved ? 'Unsave resource' : 'Save resource'}
            onPress={() =>
              update(v => ({
                ...v,
                resourceBookmarks: v.resourceBookmarks.includes(item.id)
                  ? v.resourceBookmarks.filter(id => id !== item.id)
                  : [...v.resourceBookmarks, item.id],
              }))
            }
          >
            <Bookmark
              color={saved ? colors.pink : colors.muted}
              fill={saved ? colors.pink : 'transparent'}
              size={20}
            />
          </IconButton>
        }
      />
      <GradientSurface
        colors={['#273e8b', '#54215c']}
        style={[s.card, { padding: 28 }]}
      >
        {item.kind === 'Video' ? (
          <Play size={44} color={colors.pink} />
        ) : (
          <BookOpen size={44} color={colors.cyan} />
        )}
        <Text style={s.eyebrow}>THE COMEDY READING ROOM</Text>
        <Text style={s.title}>{item.title}</Text>
        <View style={s.wrap}>
          <Badge text={item.kind} />
          <Badge text="English" color={colors.text} />
          <Badge text={item.topic} color="#c69aff" />
        </View>
      </GradientSurface>
      <Text style={s.body}>{item.description}</Text>
      <View style={s.row}>
        <ExternalLink size={18} color={colors.cyan} />
        <Text style={[s.label, { flex: 1 }]}>{item.source}</Text>
      </View>
      <Text selectable style={s.small}>
        {item.url}
      </Text>
      <Button
        title={
          opening
            ? 'Opening...'
            : item.kind === 'Video'
            ? 'Watch in browser ↗'
            : 'Read full article ↗'
        }
        onPress={open}
        disabled={opening}
      />
      <Card>
        <Sparkles color={colors.pink} />
        <Text style={s.heading}>Try it at the festival</Text>
        <Text style={s.body}>{item.practice}</Text>
        <Text style={s.small}>
          An original Charmius exercise to help you put the topic into practice.
        </Text>
        <Button
          secondary
          title="Try a related challenge"
          onPress={() =>
            navigation.navigate('Challenge', { id: item.challengeId })
          }
        />
      </Card>
      <Text style={s.small}>
        The linked material belongs to its publisher. Bookmarks are stored on
        your phone; the full resource is available online.
      </Text>
    </Screen>
  );
}
