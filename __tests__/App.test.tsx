import { shows, foods, challenges, terms } from '../src/data';
import { images, imageFor } from '../src/data/images';
import { countMatches, createRounds } from '../src/utils/game';
import { answerQuestion } from '../src/utils/assistant';
import { showStart, showStatus } from '../src/utils/dates';

test('every supplied performance and food has its own local image', () => {
  expect(new Set(shows.map(show => show.seriesId)).size).toBe(34);
  expect(foods).toHaveLength(31);
  [...shows, ...foods].forEach(item =>
    expect(imageFor(item.title)).toBeDefined(),
  );
  expect(images['brand-logo']).toBeDefined();
});

test('all challenge input fields and photo requirements were imported', () => {
  expect(challenges).toHaveLength(32);
  challenges.forEach(challenge => {
    expect(challenge.fields.length).toBeGreaterThan(0);
    expect(challenge.steps.length).toBeGreaterThan(0);
    expect(challenge.photo).toBe(challenge.category === 'PHOTO CHALLENGE');
  });
  expect(challenges.find(x => x.id === '15')?.wordLimit).toBe(5);
  expect(challenges.find(x => x.id === '32')?.wordLimit).toBe(6);
});

test('maximum game contains unique questions with all correct choices and two decoys', () => {
  const rounds = createRounds(12);
  expect(new Set(rounds.flatMap(x => x.questions.map(q => q.id))).size).toBe(
    36,
  );
  rounds.forEach(round => {
    expect(round.questions).toHaveLength(3);
    expect(new Set(round.answers.map(x => x.id)).size).toBe(5);
    round.questions.forEach(q => expect(round.answers).toContainEqual(q));
    expect(
      countMatches(
        round,
        Object.fromEntries(round.questions.map(q => [q.id, q.id])),
      ),
    ).toBe(3);
    expect(countMatches(round, {})).toBe(0);
  });
  expect(terms).toHaveLength(50);
});

test('performance status follows the provided 2026 date and duration', () => {
  jest.useFakeTimers();
  const show = shows[0];
  jest.setSystemTime(new Date('2026-11-20T17:00:00'));
  expect(showStatus(show)).toBe('Upcoming');
  jest.setSystemTime(showStart(show));
  expect(showStatus(show)).toBe('Live now');
  jest.setSystemTime(new Date('2026-11-20T19:26:00'));
  expect(showStatus(show)).toBe('Performed');
  jest.useRealTimers();
});

test('assistant answers from supplied information and admits missing information', () => {
  expect(answerQuestion('When does the Finale start?')).toContain('19:30');
  expect(answerQuestion('Is there parking?')).toContain('P1');
  expect(answerQuestion('What is the Wi-Fi?')).toContain('Charmius-Guest');
  expect(answerQuestion('How do I vote?')).toContain('vote');
  expect(answerQuestion('astronaut banana')).toContain('couldn’t find');
});
