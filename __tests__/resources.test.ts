import { resources } from '../src/data/resources';
import { challenges } from '../src/data';
test('library links use publisher HTTPS pages and valid related challenges', () => {
  expect(resources.filter(x => x.kind === 'Video').length).toBeGreaterThan(0);
  expect(resources.filter(x => x.kind === 'Article').length).toBeGreaterThan(0);
  expect(new Set(resources.map(x => x.id)).size).toBe(resources.length);
  for (const item of resources) {
    expect(item.url).toMatch(
      /^https:\/\/(www\.)?(ted\.com|bbcmaestro\.com|secondcity\.com|news\.uchicago\.edu)\//,
    );
    expect(challenges.some(x => x.id === item.challengeId)).toBe(true);
  }
});
