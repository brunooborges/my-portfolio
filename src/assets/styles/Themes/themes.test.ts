import dark from './default';
import light from './light';

/** WCAG 2.x relative luminance of a #RRGGBB color. */
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const TEXT_MIN = 4.5;
const UI_MIN = 3;

describe.each([
  ['dark', dark],
  ['light', light],
])('%s theme', (name, theme) => {
  const { colors } = theme;
  const surfaces = [
    ['page background', colors.background],
    ['panel', colors.primary.light],
    ['raised surface', colors.primary.lighter],
  ] as const;

  it(`declares its mode as "${name}"`, () => {
    expect(theme.mode).toBe(name);
  });

  it.each(surfaces)('keeps body text readable on the %s', (_label, surface) => {
    expect(contrast(colors.text.main, surface)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it.each(surfaces)('keeps strong text readable on the %s', (_label, surface) => {
    expect(contrast(colors.text.light, surface)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it.each(surfaces)('keeps accent text readable on the %s', (_label, surface) => {
    expect(contrast(colors.accent, surface)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it('keeps text readable over the placeholder gradient', () => {
    expect(contrast(colors.text.main, colors.primary.dark)).toBeGreaterThanOrEqual(TEXT_MIN);
    expect(contrast(colors.text.main, colors.primary.lighter)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it('keeps text readable on highlight fills (buttons, the active language)', () => {
    expect(contrast(colors.onHighlight, colors.highlight)).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it.each(surfaces)('keeps focus rings and the accent edge visible on the %s', (_label, surface) => {
    expect(contrast(colors.accent, surface)).toBeGreaterThanOrEqual(UI_MIN);
  });

  it('keeps the highlight fill itself visible against the page', () => {
    expect(contrast(colors.highlight, colors.background)).toBeGreaterThanOrEqual(1.5);
  });

  it('uses plain #RRGGBB colors so contrast can be checked', () => {
    const values = [
      colors.background,
      colors.primary.lighter,
      colors.primary.light,
      colors.primary.main,
      colors.primary.dark,
      colors.text.light,
      colors.text.main,
      colors.highlight,
      colors.accent,
      colors.onHighlight,
      colors.slider,
    ];

    for (const value of values) {
      expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('themes share one shape', () => {
  it('defines the same color roles in both', () => {
    expect(Object.keys(light.colors).sort()).toEqual(Object.keys(dark.colors).sort());
  });
});
