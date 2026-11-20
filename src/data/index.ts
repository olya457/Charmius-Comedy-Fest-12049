import content from './content.json';
import { buildMonthlySchedule } from '../utils/schedule';
export const { foods, facts, terms, challenges } = content;
export const shows = buildMonthlySchedule(content.shows);
export type Show = (typeof shows)[number];
export type Food = (typeof foods)[number];
export type Challenge = (typeof challenges)[number];
