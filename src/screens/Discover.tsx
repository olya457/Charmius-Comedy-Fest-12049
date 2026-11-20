import { GradientSurface } from '../components/GradientSurface';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Puzzle } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LearningLibrary } from './Learning';
import { ResponsiveGrid } from '../components/ResponsiveGrid';
import { facts, terms } from '../data';
import { useStore } from '../storage/AppStore';
import { RootParams } from '../navigation/types';
import {
  Screen,
  Button,
  Card,
  Chips,
  SearchField,
  Empty,
  Badge,
} from '../components/UI';
import { colors, styles as s } from '../theme';
export function Discover() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const { state } = useStore();
  const [tab, setTab] = useState('Festival Trivia');
  const [query, setQuery] = useState('');
  const dictionary = tab === 'Comedy Dictionary';
  const items = (dictionary ? terms : facts).filter(x =>
    `${x.title} ${x.description} ${x.category}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <Screen tone="purple">
      <Text style={[s.eyebrow, { color: '#a17cff' }]}>
        LEARN · PLAY · LAUGH
      </Text>
      <Text style={s.title}>Discover</Text>
      <GradientSurface
        colors={['#4167ff', '#7d37ff', '#eb32c2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          s.card,
          { borderWidth: 0, padding: 22, gap: 22, overflow: 'hidden' },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            width: 170,
            height: 170,
            borderRadius: 85,
            borderWidth: 20,
            borderColor: '#ffffff18',
            right: -50,
            top: -45,
          }}
        />
        <View style={s.row}>
          <Puzzle size={18} color="white" />
          <Text style={[s.eyebrow, { color: 'white' }]}>MINI GAME</Text>
        </View>
        <Text style={s.title}>Match Challenge</Text>
        <Text style={[s.body, { color: '#eeeaff', maxWidth: 270 }]}>
          Pair comedy terms with the right answers. Beat your best score.
        </Text>
        <Button
          secondary
          title="Start Challenge  →"
          onPress={() => navigation.navigate('Game')}
        />
        <Text style={[s.small, { color: 'white' }]}>
          Your best: {state.bestScore} pts
        </Text>
      </GradientSurface>
      <Chips
        items={['Festival Trivia', 'Comedy Dictionary', 'Watch & Read']}
        value={tab}
        onChange={setTab}
      />
      {tab === 'Watch & Read' ? (
        <LearningLibrary />
      ) : (
        <>
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={
              dictionary ? 'Search comedy terms...' : 'Search festival facts...'
            }
          />
          {items.length ? (
            <ResponsiveGrid>
              {items.map((item, i) => (
                <Card
                  key={item.id}
                  style={{
                    backgroundColor: dictionary
                      ? colors.card
                      : i % 3 === 1
                      ? '#28132f'
                      : i % 3 === 2
                      ? '#111a3c'
                      : colors.card,
                    borderColor: dictionary
                      ? colors.border
                      : i % 3 === 1
                      ? '#622052'
                      : i % 3 === 2
                      ? '#253b87'
                      : colors.border,
                    padding: 22,
                  }}
                >
                  {dictionary ? (
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <Text style={[s.title, { color: '#7560c8' }]}>
                        {item.title[0]}
                      </Text>
                      <View style={{ flex: 1, gap: 12 }}>
                        <View style={[s.between, { flexWrap: 'wrap' }]}>
                          <Text style={s.heading}>{item.title}</Text>
                          <Badge text={item.category} color="#ab8cff" />
                        </View>
                        <Text style={s.body}>{item.description}</Text>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={s.between}>
                        <Text
                          style={[
                            s.eyebrow,
                            {
                              color: i % 3 === 1 ? '#ff8cd9' : colors.cyan,
                              flex: 1,
                            },
                          ]}
                        >
                          {item.category}
                        </Text>
                        <Text style={s.small}>
                          NO. {item.id.padStart(2, '0')}
                        </Text>
                      </View>
                      <Text
                        style={[
                          s.title,
                          {
                            fontSize: 28,
                            lineHeight: 33,
                            marginTop: 12,
                            color:
                              i % 3 === 1
                                ? '#ff8cd9'
                                : i % 3 === 2
                                ? colors.cyan
                                : colors.text,
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={s.body}>{item.description}</Text>
                    </>
                  )}
                </Card>
              ))}
            </ResponsiveGrid>
          ) : (
            <Empty
              title={`Nothing matches “${query}”`}
              description={'Try “improv”, “stage” or “writing”.'}
            />
          )}
        </>
      )}
    </Screen>
  );
}
