import { challenges } from '../src/data';
import { countWords, isChallengeComplete } from '../src/utils/validation';
test('empty input cannot complete a challenge', () => {
  for (const challenge of challenges) {
    expect(isChallengeComplete(challenge, {})).toBe(false);
  }
});
test('photo challenges require a real attached photo and all requested fields', () => {
  const challenge = challenges.find(x => x.photo)!;
  const fields = Object.fromEntries(
    challenge.fields.map(f => [f.label, 'A user-entered answer']),
  );
  expect(isChallengeComplete(challenge, fields)).toBe(false);
  expect(isChallengeComplete(challenge, fields, 'file:///photo.jpg')).toBe(
    true,
  );
});
test('word challenges enforce their exact word count', () => {
  const challenge = challenges.find(x => x.wordLimit === 5)!;
  const label = challenge.fields[0].label;
  expect(countWords('  One\n two   three ')).toBe(3);
  expect(
    isChallengeComplete(challenge, { [label]: 'One two three four' }),
  ).toBe(false);
  expect(
    isChallengeComplete(challenge, { [label]: 'One two three four five' }),
  ).toBe(true);
});
test('laugh rating must be chosen and be between one and ten', () => {
  const challenge = challenges.find(x => x.rating)!;
  const fields = Object.fromEntries(
    challenge.fields.map(f => [f.label, 'My answer']),
  );
  expect(isChallengeComplete(challenge, fields)).toBe(false);
  expect(isChallengeComplete(challenge, fields, undefined, 8)).toBe(true);
  expect(isChallengeComplete(challenge, fields, undefined, 11)).toBe(false);
});
