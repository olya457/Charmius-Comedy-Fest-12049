import React, { useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Send, Headphones, ChevronDown, ChevronUp } from '../components/Icons';
import {
  Screen,
  Back,
  Card,
  SearchField,
  Chips,
  IconButton,
  Empty,
} from '../components/UI';
import { colors, styles as s } from '../theme';
import { faq } from '../data/help';
import { useStore } from '../storage/AppStore';
import { answerQuestion } from '../utils/assistant';
export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const list = faq.filter(x =>
    x.join(' ').toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Screen bottom={40}>
      <Back />
      <Text style={s.title}>Festival Questions</Text>
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="Search questions..."
      />
      {list.map(([question, answer], i) => (
        <Pressable
          key={question}
          accessibilityRole="button"
          accessibilityState={{ expanded: open === i }}
          onPress={() => setOpen(open === i ? null : i)}
        >
          <Card>
            <View style={s.row}>
              <Text style={[s.label, { flex: 1 }]}>{question}</Text>
              {open === i ? (
                <ChevronUp size={18} color={colors.cyan} />
              ) : (
                <ChevronDown size={18} color={colors.muted} />
              )}
            </View>
            {open === i && <Text style={s.body}>{answer}</Text>}
          </Card>
        </Pressable>
      ))}
      {!list.length && (
        <Empty
          title="No matching questions"
          description="Try another word or ask the festival assistant."
        />
      )}
    </Screen>
  );
}
export function Assistant() {
  const { state, update } = useStore();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const send = async (value: string) => {
    const question = value.trim();
    if (!question || sending) {
      return;
    }
    setSending(true);
    const answer = answerQuestion(question);
    const id = Date.now().toString();
    const ok = await update(v => ({
      ...v,
      messages: [
        ...v.messages,
        { id, role: 'user', text: question },
        { id: id + 'a', role: 'assistant', text: answer },
      ],
    }));
    if (ok) {
      setText('');
    }
    setSending(false);
  };
  return (
    <Screen scroll={false} bottom={28}>
      <Back
        right={
          <View style={[s.row, { flex: 1, justifyContent: 'flex-end' }]}>
            <Headphones color={colors.pink} size={26} />
            <View>
              <Text style={s.label}>Festival Assistant</Text>
              <Text style={[s.small, { color: colors.green }]}>
                Offline festival guide
              </Text>
            </View>
          </View>
        }
      />
      <ScrollView
        ref={scroll}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
        style={{ flex: 1 }}
      >
        <View
          style={[
            s.card,
            {
              alignSelf: 'flex-start',
              maxWidth: '92%',
              borderBottomLeftRadius: 6,
            },
          ]}
        >
          <Text style={s.body}>
            Hi! I’m the Charmius guide. Ask me about shows, stages, food,
            facilities or festival rules.
          </Text>
        </View>
        {state.messages.map(message => (
          <View
            key={message.id}
            style={{
              maxWidth: '90%',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor:
                message.role === 'user' ? '#5850fa' : colors.card,
              padding: 15,
              borderRadius: 23,
              borderBottomRightRadius: message.role === 'user' ? 6 : 23,
              borderBottomLeftRadius: message.role === 'assistant' ? 6 : 23,
            }}
          >
            <Text selectable style={[s.body, { color: colors.text }]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Chips
        items={[
          'When does the Finale start?',
          'Is there parking?',
          'How do I vote?',
          'Where can I find food?',
        ]}
        value=""
        onChange={send}
      />
      <View style={s.row}>
        <TextInput
          accessibilityLabel="Message to festival assistant"
          placeholder="Ask about shows, food, Wi-Fi..."
          placeholderTextColor={colors.dim}
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => send(text)}
          maxLength={500}
          style={[s.input, { flex: 1 }]}
          returnKeyType="send"
        />
        <IconButton label="Send message" onPress={() => send(text)}>
          <Send color={sending ? colors.dim : colors.pink} size={24} />
        </IconButton>
      </View>
    </Screen>
  );
}
