export function layoutFor(width: number, height: number, horizontalInsets = 0) {
  const available = Math.max(0, width - horizontalInsets);
  const compact = available < 360;
  const wide = available >= 720;
  return {
    compact,
    wide,
    landscape: width > height,
    padding: compact ? 14 : wide ? 28 : 20,
    heroHeight: Math.max(180, Math.min(360, height * 0.4)),
  };
}
export function gridMetrics(
  width: number,
  fontScale: number,
  minimum: number,
  maximum: number,
) {
  const columns = Math.max(
    1,
    Math.min(
      maximum,
      Math.floor((width + 12) / (minimum * Math.max(1, fontScale) + 12)),
    ),
  );
  return {
    columns,
    itemWidth: Math.max(0, (width - (columns - 1) * 12) / columns),
  };
}
