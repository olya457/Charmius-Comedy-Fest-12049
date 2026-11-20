import { Challenge } from '../data';
export function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}
export function isChallengeComplete(
  challenge: Challenge,
  fields: Record<string, string>,
  photo?: string,
  rating = 0,
): boolean {
  return (
    challenge.fields.every(
      field => field.optional || !!fields[field.label]?.trim(),
    ) &&
    (!challenge.photo || !!photo) &&
    (!challenge.rating || (rating >= 1 && rating <= 10)) &&
    (!challenge.wordLimit ||
      countWords(fields[challenge.fields[0].label] || '') ===
        challenge.wordLimit)
  );
}
