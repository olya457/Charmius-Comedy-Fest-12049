import { gridMetrics, layoutFor } from '../src/utils/layout';
test.each([320, 350, 375, 393, 600, 720, 844, 1024, 1366])(
  'grid fits a %i point viewport at all supported text sizes',
  width => {
    for (const scale of [1, 1.3, 1.8, 2]) {
      const layout = layoutFor(width, 700, 40);
      const available = Math.min(width - 40, 1100) - layout.padding * 2;
      for (const minimum of [145, 155, 160, 290, 310, 330]) {
        const { columns, itemWidth } = gridMetrics(
          available,
          scale,
          minimum,
          4,
        );
        expect(itemWidth).toBeGreaterThan(0);
        expect(itemWidth * columns + (columns - 1) * 12).toBeCloseTo(available);
      }
    }
  },
);
test('folding and unfolding changes columns without device-name assumptions', () => {
  expect(gridMetrics(280, 1, 290, 3).columns).toBe(1);
  expect(gridMetrics(800, 1, 290, 3).columns).toBe(2);
  expect(gridMetrics(1000, 1, 290, 3).columns).toBe(3);
  expect(gridMetrics(800, 2, 290, 3).columns).toBe(1);
  expect(layoutFor(320, 568).compact).toBe(true);
  expect(layoutFor(900, 650).wide).toBe(true);
});
