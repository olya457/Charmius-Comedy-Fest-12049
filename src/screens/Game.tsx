import { ResponsiveGrid } from '../components/ResponsiveGrid';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  AppState,
  Modal,
  Alert,
} from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import { Pause, Timer, Trophy, Minus, Plus } from '../components/Icons';
import {
  Screen,
  Back,
  Button,
  Card,
  Chips,
  Progress,
  IconButton,
} from '../components/UI';
import { colors, styles as s } from '../theme';
import { useStore } from '../storage/AppStore';
import { createRounds, countMatches, Round } from '../utils/game';
import { ScreenProps } from '../navigation/types';
export function Game({ navigation }: ScreenProps<'Game'>) {
  const { state, update } = useStore();
  const [phase, setPhase] = useState<'setup' | 'playing' | 'review' | 'result'>(
    'setup',
  );
  const [count, setCount] = useState(5);
  const [seconds, setSeconds] = useState(30);
  const [unlimited, setUnlimited] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(30);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [correct, setCorrect] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const deadline = useRef(0);
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;
  const checked = useRef(false);
  const matchesRef = useRef(matches);
  matchesRef.current = matches;
  const round = rounds[index];
  const active = phase === 'playing' || phase === 'review';
  usePreventRemove(active, ({ data }) => {
    setPaused(true);
    Alert.alert('Exit challenge?', 'Your current round will not be saved.', [
      {
        text: 'Keep playing',
        style: 'cancel',
        onPress: () => setPaused(false),
      },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });
  useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      if (status !== 'active' && active) {
        setPaused(true);
      }
    });
    return () => subscription.remove();
  }, [active]);
  useEffect(() => {
    if (phase !== 'playing' || paused || unlimited) {
      return;
    }
    deadline.current = Date.now() + remainingRef.current * 1000;
    const timer = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left === 0 && !checked.current) {
        checked.current = true;
        setCorrect(v => v + countMatches(round, matchesRef.current));
        setPhase('review');
      }
    }, 150);
    return () => clearInterval(timer);
  }, [phase, paused, unlimited, index, round]);
  const start = () => {
    setRounds(createRounds(count));
    setIndex(0);
    setRemaining(seconds);
    setCorrect(0);
    setMatches({});
    setSelected(null);
    setPreviousBest(state.bestScore);
    checked.current = false;
    setPaused(false);
    setPhase('playing');
  };
  const check = () => {
    if (checked.current) {
      return;
    }
    checked.current = true;
    setCorrect(v => v + countMatches(round, matches));
    setPhase('review');
  };
  const next = async () => {
    if (index === rounds.length - 1) {
      const ok = await update(v => ({
        ...v,
        bestScore: Math.max(v.bestScore, correct * 100),
      }));
      if (ok) {
        setPhase('result');
      }
      return;
    }
    setIndex(v => v + 1);
    setMatches({});
    setSelected(null);
    setRemaining(seconds);
    checked.current = false;
    setPhase('playing');
  };
  if (phase === 'setup') {
    return (
      <Screen key={phase} tone="purple" bottom={40}>
        <Back />
        <Text style={s.title}>Match Challenge</Text>
        <Text style={s.body}>
          Each round shows 3 definitions and 5 answers. Match all three — two
          answers are decoys.
        </Text>
        <Card>
          <View style={s.between}>
            <View>
              <Text style={s.label}>Questions</Text>
              <Text style={s.small}>{count * 3} matches in total</Text>
            </View>
            <View style={s.row}>
              <IconButton
                label="Fewer questions"
                onPress={() => setCount(Math.max(1, count - 1))}
              >
                <Minus color="white" size={18} />
              </IconButton>
              <Text style={s.heading}>{count}</Text>
              <IconButton
                label="More questions"
                onPress={() => setCount(Math.min(12, count + 1))}
              >
                <Plus color="white" size={18} />
              </IconButton>
            </View>
          </View>
        </Card>
        <Card style={{ opacity: unlimited ? 0.4 : 1 }}>
          <Text style={s.label}>Time per question</Text>
          <Text style={s.small}>The round auto-submits when time runs out</Text>
          <View pointerEvents={unlimited ? 'none' : 'auto'}>
            <Chips
              items={['15s', '30s', '60s']}
              value={`${seconds}s`}
              onChange={v => setSeconds(parseInt(v, 10))}
            />
          </View>
        </Card>
        <Card>
          <View style={s.between}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>No time limit</Text>
              <Text style={s.small}>
                Relaxed mode — take as long as you like
              </Text>
            </View>
            <Switch
              accessibilityLabel="No time limit"
              value={unlimited}
              onValueChange={setUnlimited}
              trackColor={{ true: colors.green, false: colors.border }}
            />
          </View>
        </Card>
        <Card style={{ borderColor: '#602050', backgroundColor: '#29122f' }}>
          <View style={s.row}>
            <Trophy color={colors.pink} />
            <Text style={s.label}>Your best score: {state.bestScore} pts</Text>
          </View>
        </Card>
        <Button title="Start Challenge" onPress={start} />
      </Screen>
    );
  }
  if (phase === 'result') {
    return (
      <Screen key={phase} tone="purple" bottom={40}>
        <Text style={[s.eyebrow, { textAlign: 'center', marginTop: 30 }]}>
          {correct * 100 > previousBest
            ? 'NEW PERSONAL BEST'
            : 'CHALLENGE COMPLETE'}
        </Text>
        <View
          style={{
            height: 230,
            width: 230,
            borderRadius: 115,
            borderWidth: 14,
            borderColor: colors.pink,
            borderTopColor: colors.cyan,
            borderRightColor: '#a17cff',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}
        >
          <Text style={[s.title, { fontSize: 54, lineHeight: 64 }]}>
            {correct * 100}
          </Text>
          <Text style={s.small}>points</Text>
        </View>
        <Text style={[s.title, { textAlign: 'center' }]}>
          {correct === count * 3
            ? 'Standing ovation!'
            : correct > count
            ? 'Solid set!'
            : 'Keep the laughs coming!'}
        </Text>
        <ResponsiveGrid minimum={145} maximum={4}>
          {[
            ['Correct matches', `${correct}/${count * 3}`],
            ['Accuracy', `${Math.round((correct / (count * 3)) * 100)}%`],
            ['This score', `${correct * 100}`],
            ['Previous best', `${previousBest}`],
          ].map(([label, value]) => (
            <Card key={label} style={{ padding: 16 }}>
              <Text style={s.small}>{label}</Text>
              <Text style={s.heading}>{value}</Text>
            </Card>
          ))}
        </ResponsiveGrid>
        <Button title="Play Again" onPress={start} />
        <Button
          title="Back to Discover"
          secondary
          onPress={() => navigation.goBack()}
        />
      </Screen>
    );
  }
  const review = phase === 'review';
  return (
    <Screen key={phase} tone="purple" bottom={40}>
      <View style={s.between}>
        <IconButton label="Pause challenge" onPress={() => setPaused(true)}>
          <Pause color="white" size={20} />
        </IconButton>
        <Text style={s.label}>
          Question {index + 1} of {count}
        </Text>
        <View style={s.row}>
          <Timer
            size={18}
            color={remaining <= 5 && !unlimited ? colors.pink : colors.muted}
          />
          <Text style={s.label}>
            {unlimited ? '∞' : `0:${String(remaining).padStart(2, '0')}`}
          </Text>
        </View>
      </View>
      <Progress value={(index + (review ? 1 : 0)) / count} />
      <Text style={s.small}>
        {review
          ? 'Here’s how you did:'
          : 'Tap a definition, then tap its matching answer.'}
      </Text>
      {round.questions.map((q, i) => {
        const answer = round.answers.find(x => x.id === matches[q.id]);
        const color = review
          ? matches[q.id] === q.id
            ? colors.green
            : '#ff497c'
          : selected === q.id
          ? 'white'
          : colors.border;
        return (
          <Pressable
            key={q.id}
            disabled={review}
            onPress={() => setSelected(q.id)}
          >
            <Card
              style={{
                borderColor: color,
                borderWidth: selected === q.id || review ? 2 : 1,
                padding: 16,
                borderRadius: 22,
              }}
            >
              <View style={s.row}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: [colors.blue, colors.pink, colors.cyan][i],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={s.label}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={s.label}>{q.description}</Text>
                  <Text
                    style={[s.small, { color: review ? color : colors.cyan }]}
                  >
                    {review
                      ? matches[q.id] === q.id
                        ? '✓ ' + q.title
                        : `✕ ${answer?.title || 'No answer'} · Correct: ${
                            q.title
                          }`
                      : answer
                      ? '→ ' + answer.title
                      : selected === q.id
                      ? 'Now pick an answer...'
                      : 'Tap to select'}
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}
      <Text style={[s.eyebrow, { textAlign: 'center', color: colors.dim }]}>
        ANSWERS
      </Text>
      <View style={s.wrap}>
        {round.answers.map(answer => {
          const assigned = round.questions.findIndex(
            q => matches[q.id] === answer.id,
          );
          return (
            <Pressable
              key={answer.id}
              accessibilityRole="button"
              disabled={review || !selected}
              onPress={() => {
                if (!selected) {
                  return;
                }
                setMatches(v => {
                  const nextMatches = { ...v };
                  Object.keys(nextMatches).forEach(key => {
                    if (nextMatches[key] === answer.id) {
                      delete nextMatches[key];
                    }
                  });
                  nextMatches[selected] = answer.id;
                  return nextMatches;
                });
                setSelected(null);
              }}
              style={{
                padding: 14,
                borderRadius: 18,
                borderWidth: 2,
                borderColor:
                  assigned >= 0
                    ? [colors.blue, colors.pink, colors.cyan][assigned]
                    : colors.border,
                backgroundColor: colors.card,
              }}
            >
              <Text style={s.label}>
                {assigned >= 0 ? `${assigned + 1}  ` : ''}
                {answer.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {review && (
        <Card>
          <Text style={s.label}>
            {countMatches(round, matches)} of 3 correct.{' '}
            {countMatches(round, matches) === 3
              ? 'Perfect match!'
              : 'Keep going!'}
          </Text>
        </Card>
      )}
      <Button
        title={
          review
            ? index === count - 1
              ? 'See Results'
              : 'Next Question'
            : 'Check Matches'
        }
        disabled={!review && Object.keys(matches).length < 3}
        onPress={review ? next : check}
      />
      <Modal
        visible={paused}
        transparent
        animationType="fade"
        onRequestClose={() => setPaused(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#070a20f5',
            justifyContent: 'center',
            padding: 30,
            gap: 28,
          }}
        >
          <Pause color="white" size={50} style={{ alignSelf: 'center' }} />
          <Text style={[s.title, { textAlign: 'center' }]}>Paused</Text>
          <Text style={[s.body, { textAlign: 'center' }]}>
            Question {index + 1} of {count}. Your timer is paused.
          </Text>
          <Button title="Resume" onPress={() => setPaused(false)} />
          <Button
            title="Exit Challenge"
            danger
            onPress={() => {
              setPaused(false);
              setPhase('setup');
            }}
          />
        </View>
      </Modal>
    </Screen>
  );
}
