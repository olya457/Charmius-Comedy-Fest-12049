import { useLayout } from '../hooks/useLayout';
import { ResponsiveGrid } from '../components/ResponsiveGrid';
import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Store, Utensils } from '../components/Icons';
import { foods } from '../data';
import { imageFor } from '../data/images';
import { RootParams, ScreenProps } from '../navigation/types';
import {
  Screen,
  SearchField,
  Chips,
  Empty,
  Card,
  Badge,
  Back,
} from '../components/UI';
import { colors, styles as s } from '../theme';
export function Food() {
  const nav = useNavigation<NativeStackNavigationProp<RootParams>>();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const list = foods.filter(
    x =>
      (category === 'All' || x.category === category) &&
      `${x.title} ${x.description} ${x.vendor}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <Screen>
      <Text style={[s.eyebrow, { color: colors.cyan }]}>
        TAKE A BREAK · GRAB A BITE
      </Text>
      <Text style={s.title}>Food & Drinks</Text>
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Search burgers, coffee, vendors..."
      />
      <Chips
        items={['All', ...new Set(foods.map(x => x.category))]}
        value={category}
        onChange={setCategory}
      />
      {!list.length ? (
        <Empty
          title="No dishes found"
          description="Try another category or search term."
        />
      ) : (
        <ResponsiveGrid minimum={155} maximum={4}>
          {list.map(food => (
            <Pressable
              key={food.id}
              accessibilityRole="button"
              accessibilityLabel={`View ${food.title}`}
              onPress={() => nav.navigate('Dish', { id: food.id })}
              style={[
                s.card,
                {
                  padding: 8,
                  gap: 9,
                  borderRadius: 24,
                  overflow: 'hidden',
                },
              ]}
            >
              <View
                style={{
                  width: '100%',
                  aspectRatio: 1.2,
                  borderRadius: 18,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={imageFor(food.title)}
                  resizeMode="cover"
                  style={[
                    StyleSheet.absoluteFill,
                    { width: '100%', height: '100%' },
                  ]}
                />
                <View
                  style={{
                    position: 'absolute',
                    right: 7,
                    top: 7,
                    backgroundColor: '#080917bb',
                    borderRadius: 16,
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={[s.label, { fontSize: 12 }]}>{food.price}</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 5, gap: 6, paddingBottom: 9 }}>
                <Text style={[s.label, { fontSize: 14 }]}>{food.title}</Text>
                <Text numberOfLines={3} style={s.small}>
                  {food.description}
                </Text>
                <Text style={[s.small, { color: colors.cyan }]}>
                  {food.vendor}
                </Text>
              </View>
            </Pressable>
          ))}
        </ResponsiveGrid>
      )}
    </Screen>
  );
}
export function DishDetail({ route }: ScreenProps<'Dish'>) {
  const { padding, heroHeight } = useLayout();
  const food = foods.find(x => x.id === route.params.id)!;
  return (
    <Screen bottom={40}>
      <View style={{ marginHorizontal: -padding, marginTop: -padding }}>
        <Image
          source={imageFor(food.title)}
          style={{ width: '100%', height: heroHeight }}
        />
        <View style={{ position: 'absolute', top: 20, left: 20, right: 20 }}>
          <Back />
        </View>
      </View>
      <Card style={{ marginTop: -55, backgroundColor: '#131a45' }}>
        <View style={s.between}>
          <Badge text={food.category} />
          <Text style={s.heading}>{food.price}</Text>
        </View>
        <Text style={s.title}>{food.title}</Text>
        <View style={s.row}>
          <Store size={18} color={colors.pink} />
          <Text style={[s.small, { flex: 1 }]}>
            {food.vendor} · {food.location}
          </Text>
        </View>
      </Card>
      <Text style={s.body}>{food.description}</Text>
      <Text style={s.heading}>Ingredients</Text>
      <Text style={s.body}>{food.ingredients}</Text>
      <Text style={s.heading}>Allergens</Text>
      <View style={s.wrap}>
        {food.allergens.split(', ').map(item => (
          <Badge key={item} text={item} color="#ffc677" />
        ))}
      </View>
      <Card>
        <View style={s.row}>
          <Utensils color={colors.cyan} size={24} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={s.label}>Serving</Text>
            <Text style={s.small}>{food.serving}</Text>
          </View>
        </View>
      </Card>
      <Text style={[s.small, { textAlign: 'center' }]}>
        Order and pay at the counter — this menu is for browsing only.
      </Text>
    </Screen>
  );
}
