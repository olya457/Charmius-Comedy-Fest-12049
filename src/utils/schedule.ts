type ScheduleSeed = { id: string; dateKey: string; date: string; time: string };
export function buildMonthlySchedule<T extends ScheduleSeed>(
  templates: T[],
  monthCount = 6,
): Array<T & { seriesId: string }> {
  if (!templates.length || monthCount < 1) {
    return [];
  }
  const first = templates.map(item => item.dateKey).sort()[0];
  const [startYear, startMonth] = first.split('-').map(Number);
  const result: Array<T & { seriesId: string }> = [];
  for (let offset = 0; offset < monthCount; offset++) {
    const month = new Date(Date.UTC(startYear, startMonth - 1 + offset, 1));
    const year = month.getUTCFullYear();
    const monthIndex = month.getUTCMonth();
    const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    for (const template of templates) {
      const day = Math.min(Number(template.dateKey.slice(-2)), lastDay);
      const occurrence = new Date(Date.UTC(year, monthIndex, day));
      const dateKey = occurrence.toISOString().slice(0, 10);
      if (dateKey < template.dateKey) {
        continue;
      }
      result.push({
        ...template,
        seriesId: template.id,
        id:
          dateKey === template.dateKey
            ? template.id
            : `${template.id}@${dateKey}`,
        dateKey,
        date: occurrence.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }),
      });
    }
  }
  return result.sort(
    (a, b) =>
      a.dateKey.localeCompare(b.dateKey) ||
      a.time.localeCompare(b.time) ||
      a.id.localeCompare(b.id),
  );
}
