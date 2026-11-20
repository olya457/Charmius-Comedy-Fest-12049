import { terms } from '../data';
export type Round = { questions: typeof terms; answers: typeof terms };
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function createRounds(count: number): Round[] {
  const pool = shuffle(terms);
  return Array.from({ length: Math.min(12, Math.max(1, count)) }, (_, i) => {
    const questions = pool.slice(i * 3, i * 3 + 3);
    const decoys = shuffle(
      terms.filter(x => !questions.some(q => q.id === x.id)),
    ).slice(0, 2);
    return { questions, answers: shuffle([...questions, ...decoys]) };
  });
}
export function countMatches(
  round: Round,
  matches: Record<string, string>,
): number {
  return round.questions.filter(q => matches[q.id] === q.id).length;
}
