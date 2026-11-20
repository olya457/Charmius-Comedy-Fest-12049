import { shows, foods, terms } from '../data';
import { formatShowDate, localDateKey, showStart } from './dates';
import { faq, services } from '../data/help';
const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(
      x =>
        x.length > 2 &&
        ![
          'the',
          'what',
          'where',
          'when',
          'how',
          'can',
          'does',
          'are',
          'there',
          'find',
          'have',
          'with',
          'about',
          'show',
          'please',
          'this',
          'that',
        ].includes(x),
    );
export function answerQuestion(query: string): string {
  const q = query.toLowerCase();
  const matchingShows = shows.filter(
    x =>
      q.includes(x.title.toLowerCase()) ||
      (q.includes('finale') && x.title.includes('Finale')),
  );
  const show =
    matchingShows.find(item => showStart(item).getTime() >= Date.now()) ||
    matchingShows[matchingShows.length - 1];
  if (show) {
    return `${show.title}\n${formatShowDate(show)} · ${show.time}\n${
      show.stage
    } · ${show.duration} minutes · ${show.age}\n\n${show.description}`;
  }
  if (/next|today|tonight/.test(q) && /show|performance|schedule/.test(q)) {
    const today = localDateKey();
    const next = /next/.test(q) && !/today|tonight/.test(q);
    const list = next
      ? shows.filter(x => showStart(x).getTime() >= Date.now()).slice(0, 3)
      : shows.filter(x => x.dateKey === today);
    return list.length
      ? list
          .map(
            x => `${formatShowDate(x)} · ${x.time} · ${x.title} · ${x.stage}`,
          )
          .join('\n\n')
      : next
      ? 'There are no more upcoming performances in this six-month schedule.'
      : 'There are no performances listed for today. Open Festival Schedule to choose another date.';
  }
  const food = foods.find(x => q.includes(x.title.toLowerCase()));
  if (food) {
    return `${food.title} · ${food.price}\n${food.vendor} · ${food.location}\n\n${food.description}\n\nAllergens: ${food.allergens}`;
  }
  const normalized = q.replace(/wi[ -]?fi/g, 'wifi');
  const service = services.find(x =>
    normalized.includes(
      x.title
        .toLowerCase()
        .replace(/free | help/g, '')
        .replace('wi-fi', 'wifi'),
    ),
  );
  if (service) {
    return `${service.title}: ${service.description}.`;
  }
  const term = terms.find(x => q.includes(x.title.toLowerCase()));
  if (term) {
    return `${term.title}: ${term.description}`;
  }
  const tokens = words(query);
  const scored = faq
    .map(([question, answer]) => ({
      answer,
      score: tokens.reduce(
        (total, w) =>
          total +
          (question.toLowerCase().includes(w)
            ? 3
            : answer.toLowerCase().includes(w)
            ? 1
            : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score);
  if (scored[0]?.score >= 3) {
    return scored[0].answer;
  }
  return 'I couldn’t find a reliable answer in the festival guide. Try asking about a show by name, parking, Wi-Fi, voting, food, or accessibility. For information not in the guide, please ask the Info Point at the main entrance.';
}
