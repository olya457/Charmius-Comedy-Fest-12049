import content from '../src/data/content.json';
import { shows } from '../src/data';
import { buildMonthlySchedule } from '../src/utils/schedule';
import { formatShowDate } from '../src/utils/dates';
import { answerQuestion } from '../src/utils/assistant';
test('six calendar months include every original show with stable independent occurrence IDs', () => {
  expect([...new Set(shows.map(x => x.dateKey.slice(0, 7)))]).toEqual([
    '2026-11',
    '2026-12',
    '2027-01',
    '2027-02',
    '2027-03',
    '2027-04',
  ]);
  expect(shows).toHaveLength(187);
  expect(new Set(shows.map(x => x.id)).size).toBe(shows.length);
  for (const source of content.shows) {
    expect(shows.find(x => x.id === source.id)).toMatchObject({
      title: source.title,
      dateKey: source.dateKey,
      time: source.time,
      stage: source.stage,
    });
    const repeats = shows.filter(x => x.seriesId === source.id);
    expect(repeats.length).toBe(source.dateKey.startsWith('2026-11') ? 6 : 5);
    for (const repeat of repeats) {
      expect(repeat.dateKey.slice(-2)).toBe(source.dateKey.slice(-2));
      expect(repeat.time).toBe(source.time);
      expect(repeat.stage).toBe(source.stage);
    }
  }
});
test('calendar repeats clamp month-end dates without drifting the next month', () => {
  const seed = {
    id: 'test',
    dateKey: '2026-12-31',
    date: 'Thu, Dec 31',
    time: '18:00 – 19:00',
  };
  const list = buildMonthlySchedule([seed], 4);
  expect(list.map(x => x.dateKey)).toEqual([
    '2026-12-31',
    '2027-01-31',
    '2027-02-28',
    '2027-03-31',
  ]);
  expect(list[2].date).toBe('Sun, Feb 28');
  expect(buildMonthlySchedule([], 6)).toEqual([]);
});
test('schedule is chronological and displays the occurrence year', () => {
  const chronological = shows.map(x => `${x.dateKey} ${x.time}`);
  expect(chronological).toEqual([...chronological].sort());
  expect(
    formatShowDate(shows.find(x => x.dateKey === '2027-01-20')!),
  ).toContain('2027');
});
test('assistant returns the next monthly occurrence instead of a past original date', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2027-02-01T10:00:00'));
  expect(answerQuestion('When does the Finale start?')).toContain(
    'Feb 22, 2027',
  );
  expect(answerQuestion('What is the next show?')).toContain('Feb 4, 2027');
  jest.useRealTimers();
});
