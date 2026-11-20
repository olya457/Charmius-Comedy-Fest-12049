import { Show } from '../data';
export const showStart = (show: Show) =>
  new Date(`${show.dateKey}T${show.time.split(' – ')[0]}:00`);
export function showStatus(show: Show) {
  const now = Date.now(),
    start = showStart(show).getTime();
  return now < start
    ? 'Upcoming'
    : now < start + show.duration * 60000
    ? 'Live now'
    : 'Performed';
}
export const formatSaved = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
export const formatShowDate = (show: Show) =>
  `${show.date}, ${show.dateKey.slice(0, 4)}`;
export const formatMonth = (month: string) =>
  new Date(`${month.slice(0, 7)}-01T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
