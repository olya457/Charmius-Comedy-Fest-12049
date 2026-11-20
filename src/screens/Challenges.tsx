import { ResponsiveGrid } from '../components/ResponsiveGrid';
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {
  Camera,
  PencilLine,
  Sparkles,
  BookOpen,
  CheckCircle,
  Trash2,
  Pencil,
} from '../components/Icons';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { challenges, Challenge } from '../data';
import { useStore, Submission } from '../storage/AppStore';
import {
  Screen,
  Card,
  Chips,
  Progress,
  Empty,
  Back,
  Button,
  IconButton,
} from '../components/UI';
import { RootParams, ScreenProps } from '../navigation/types';
import { colors, styles as s } from '../theme';
import { formatSaved } from '../utils/dates';
import { persistPhoto, deletePhoto } from '../utils/photos';
import { countWords, isChallengeComplete } from '../utils/validation';
const accent = (item: Challenge) =>
  item.photo
    ? colors.cyan
    : item.category === 'CREATIVE WRITING'
    ? colors.pink
    : item.category === 'FESTIVAL EXPERIENCE'
    ? '#a17cff'
    : colors.blue;
function ChallengeIcon({ item }: { item: Challenge }) {
  const Icon = item.photo
    ? Camera
    : item.category === 'CREATIVE WRITING'
    ? PencilLine
    : item.category === 'FESTIVAL EXPERIENCE'
    ? Sparkles
    : BookOpen;
  const color = accent(item);
  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 19,
        backgroundColor: color + '20',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={27} color={color} />
    </View>
  );
}
export function Challenges() {
  const nav = useNavigation<NativeStackNavigationProp<RootParams>>();
  const { state } = useStore();
  const [completed, setCompleted] = useState(false);
  const done = challenges.filter(x => state.submissions[x.id]).length;
  const tabs = [
    `Available · ${challenges.length - done}`,
    `Completed · ${done}`,
  ];
  const list = challenges.filter(x => !!state.submissions[x.id] === completed);
  return (
    <Screen tone="purple">
      <Text style={s.eyebrow}>PLAY ALONG</Text>
      <Text style={s.title}>Comedy Challenges</Text>
      <Text style={s.body}>
        Snap, write and riff your way through the festival. Your answers stay on
        your phone.
      </Text>
      <Card>
        <View style={s.between}>
          <Text style={s.label}>Your progress</Text>
          <Text style={[s.label, { color: colors.pink }]}>
            {done} of {challenges.length} done
          </Text>
        </View>
        <Progress value={done / challenges.length} />
      </Card>
      <Chips
        items={tabs}
        value={tabs[completed ? 1 : 0]}
        onChange={v => setCompleted(v === tabs[1])}
      />
      {list.length ? (
        <ResponsiveGrid minimum={310}>
          {list.map(item => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => nav.navigate('Challenge', { id: item.id })}
            >
              <Card style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <ChallengeIcon item={item} />
                  <View style={{ flex: 1, gap: 12 }}>
                    <View style={[s.between, { flexWrap: 'wrap' }]}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: accent(item),
                        }}
                      >
                        {item.category}
                      </Text>
                      <Text
                        style={[
                          s.small,
                          { color: completed ? colors.green : colors.muted },
                        ]}
                      >
                        {completed ? '✓ Done' : '○ Open'}
                      </Text>
                    </View>
                    <Text style={[s.heading, { fontSize: 18 }]}>
                      {item.title}
                    </Text>
                    <Text style={s.small} numberOfLines={4}>
                      {completed
                        ? Object.values(state.submissions[item.id].fields).join(
                            ' · ',
                          )
                        : item.description}
                    </Text>
                    {completed && (
                      <Text style={s.small}>
                        {formatSaved(state.submissions[item.id].savedAt)}
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </ResponsiveGrid>
      ) : (
        <Empty
          title={
            completed ? 'No completed challenges yet' : 'You’ve done them all!'
          }
          description={
            completed
              ? 'Finish a challenge and it will appear here.'
              : 'Your festival memories are saved in Completed.'
          }
        />
      )}
    </Screen>
  );
}
export function ChallengeDetail({
  route,
  navigation,
}: ScreenProps<'Challenge'>) {
  const item = challenges.find(x => x.id === route.params.id)!;
  const { state, update } = useStore();
  const saved = state.submissions[item.id];
  const [editing, setEditing] = useState(!saved);
  const [fields, setFields] = useState<Record<string, string>>(
    saved?.fields || {},
  );
  const [photo, setPhoto] = useState(saved?.photo);
  const [rating, setRating] = useState(saved?.rating || 0);
  const [busy, setBusy] = useState(false);
  const [clean, setClean] = useState(true);
  const wordCount = countWords(fields[item.fields[0]?.label] || '');
  const valid = isChallengeComplete(item, fields, photo, rating);
  usePreventRemove(editing && !clean, ({ data }) =>
    Alert.alert('Discard changes?', 'Your unsaved changes will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]),
  );
  const accept = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      Alert.alert(
        'Photo unavailable',
        response.errorCode === 'permission'
          ? 'Allow camera or photo access in Settings to attach your photo.'
          : response.errorMessage ||
              'Please try choosing a photo from your library.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) {
      setPhoto(uri);
      setClean(false);
    }
  };
  const pick = () =>
    Alert.alert('Attach a photo', 'Take one or choose from your library.', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera({
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1800,
            maxHeight: 1800,
            saveToPhotos: false,
          })
            .then(accept)
            .catch(() =>
              Alert.alert(
                'Camera unavailable',
                'Please choose a photo from your library.',
              ),
            ),
      },
      {
        text: 'Photo Library',
        onPress: () =>
          launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1800,
            maxHeight: 1800,
            selectionLimit: 1,
          })
            .then(accept)
            .catch(() => Alert.alert('Photo unavailable', 'Please try again.')),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  const save = async () => {
    if (!valid || busy) {
      return;
    }
    setBusy(true);
    let permanent: string | undefined;
    try {
      permanent = photo ? await persistPhoto(photo) : undefined;
      const submission: Submission = {
        fields: Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [k, v.trim()]),
        ),
        photo: permanent,
        rating: item.rating ? rating : undefined,
        savedAt: new Date().toISOString(),
      };
      const ok = await update(v => ({
        ...v,
        submissions: { ...v.submissions, [item.id]: submission },
      }));
      if (ok) {
        if (saved?.photo !== permanent) {
          await deletePhoto(saved?.photo);
        }
        setPhoto(permanent);
        setEditing(false);
        setClean(true);
      } else if (permanent !== photo) {
        await deletePhoto(permanent);
      }
    } catch {
      Alert.alert(
        'Could not save photo',
        'Please check available storage and try again.',
      );
    }
    setBusy(false);
  };
  const remove = () =>
    Alert.alert(
      'Delete Challenge?',
      `Your saved submission for “${item.title}” will be removed. The challenge will return to Available.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Challenge',
          style: 'destructive',
          onPress: async () => {
            const ok = await update(v => {
              const submissions = { ...v.submissions };
              delete submissions[item.id];
              return { ...v, submissions };
            });
            if (ok) {
              await deletePhoto(saved?.photo);
              setFields({});
              setPhoto(undefined);
              setRating(0);
              setEditing(true);
              setClean(true);
            }
          },
        },
      ],
    );
  return (
    <Screen tone="purple" bottom={40}>
      <Back
        right={
          saved ? (
            <View style={s.row}>
              {!editing && (
                <IconButton
                  label="Edit submission"
                  onPress={() => setEditing(true)}
                >
                  <Pencil size={18} color="white" />
                </IconButton>
              )}
              <IconButton label="Delete submission" onPress={remove}>
                <Trash2 size={18} color="#ff547c" />
              </IconButton>
            </View>
          ) : undefined
        }
      />
      <ChallengeIcon item={item} />
      <Text style={[s.eyebrow, { color: accent(item) }]}>{item.category}</Text>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.body}>{item.description}</Text>
      {!editing && saved ? (
        <Card style={{ borderColor: '#17675d', backgroundColor: '#0d202d' }}>
          <View style={s.between}>
            <View style={s.row}>
              <CheckCircle color={colors.green} size={18} />
              <Text style={[s.label, { color: colors.green }]}>Completed</Text>
            </View>
            <Text style={s.small}>{formatSaved(saved.savedAt)}</Text>
          </View>
          {saved.photo && (
            <View
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 18,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: saved.photo }}
                resizeMode="cover"
                style={[
                  StyleSheet.absoluteFill,
                  { width: '100%', height: '100%' },
                ]}
              />
            </View>
          )}
          {item.rating && (
            <Text style={s.heading}>Laugh rating: {saved.rating}/10</Text>
          )}
          {item.fields.map(f =>
            saved.fields[f.label] ? (
              <View key={f.label} style={{ gap: 6 }}>
                <Text style={s.small}>{f.label}</Text>
                <Text selectable style={[s.body, { color: colors.text }]}>
                  {saved.fields[f.label]}
                </Text>
              </View>
            ) : null,
          )}
        </Card>
      ) : (
        <>
          <Text style={s.heading}>How to play</Text>
          {item.steps.map((step, i) => (
            <View key={step} style={[s.row, { alignItems: 'flex-start' }]}>
              <Text
                style={[
                  s.small,
                  {
                    backgroundColor: '#ffffff15',
                    borderRadius: 12,
                    width: 25,
                    textAlign: 'center',
                    padding: 3,
                  },
                ]}
              >
                {i + 1}
              </Text>
              <Text style={[s.body, { flex: 1 }]}>{step}</Text>
            </View>
          ))}
          {item.photo &&
            (photo ? (
              <View style={{ gap: 12 }}>
                <View
                  style={{
                    width: '100%',
                    aspectRatio: 1,
                    borderRadius: 24,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={{ uri: photo }}
                    resizeMode="cover"
                    style={[
                      StyleSheet.absoluteFill,
                      { width: '100%', height: '100%' },
                    ]}
                  />
                </View>
                <View style={s.row}>
                  <View style={{ flex: 1 }}>
                    <Button secondary title="Replace" onPress={pick} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      danger
                      title="Remove"
                      onPress={() => {
                        setPhoto(undefined);
                        setClean(false);
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={pick}
                style={{
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: '#27618c',
                  borderRadius: 24,
                  minHeight: 230,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 18,
                }}
              >
                <Camera size={38} color={colors.cyan} />
                <Text style={s.label}>Attach a photo</Text>
                <Text style={s.small}>
                  Take one or choose from your library
                </Text>
              </Pressable>
            ))}
          {item.rating && (
            <>
              <Text style={s.label}>Laugh rating</Text>
              <View style={s.wrap}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: rating === n }}
                    key={n}
                    onPress={() => {
                      setRating(n);
                      setClean(false);
                    }}
                    style={[
                      s.circle,
                      {
                        backgroundColor:
                          rating === n ? colors.pink : colors.card,
                      },
                    ]}
                  >
                    <Text style={s.label}>{n}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
          {item.fields.map(field => (
            <View key={field.label} style={{ gap: 10 }}>
              <Text style={s.label}>{field.label}</Text>
              <TextInput
                accessibilityLabel={field.label}
                multiline
                textAlignVertical="top"
                placeholder={field.placeholder}
                placeholderTextColor={colors.dim}
                value={fields[field.label] || ''}
                onChangeText={value => {
                  setFields(v => ({ ...v, [field.label]: value }));
                  setClean(false);
                }}
                maxLength={1000}
                style={[s.input, { minHeight: 130, lineHeight: 23 }]}
              />
              <Text style={[s.small, { textAlign: 'right' }]}>
                {(fields[field.label] || '').length}/1000
              </Text>
            </View>
          ))}
          {!!item.wordLimit && (
            <Text
              style={[
                s.small,
                {
                  color:
                    wordCount === item.wordLimit ? colors.green : colors.pink,
                },
              ]}
            >
              {wordCount} / {item.wordLimit} words — use exactly{' '}
              {item.wordLimit} words
            </Text>
          )}
          <Button
            title={
              busy ? 'Saving...' : saved ? 'Save Changes' : 'Complete Challenge'
            }
            disabled={!valid || busy}
            onPress={save}
          />
          {saved && (
            <Button
              secondary
              title="Cancel"
              disabled={busy}
              onPress={() => {
                setFields(saved.fields);
                setPhoto(saved.photo);
                setRating(saved.rating || 0);
                setEditing(false);
                setClean(true);
              }}
            />
          )}
        </>
      )}
    </Screen>
  );
}
