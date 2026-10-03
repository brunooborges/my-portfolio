import { parseThemeMode, resolveThemeMode } from './modes';

describe('parseThemeMode', () => {
  it.each(['light', 'dark'] as const)('accepts "%s"', (mode) => {
    expect(parseThemeMode(mode)).toBe(mode);
  });

  it.each([null, undefined, '', 'Dark', 'auto', 'blue'])('rejects %j', (value) => {
    expect(parseThemeMode(value)).toBeNull();
  });
});

describe('resolveThemeMode', () => {
  it('uses the visitor explicit choice over the system preference', () => {
    expect(resolveThemeMode('dark', true)).toBe('dark');
    expect(resolveThemeMode('light', false)).toBe('light');
  });

  it('follows a light system preference when nothing was chosen', () => {
    expect(resolveThemeMode(null, true)).toBe('light');
  });

  it('defaults to dark, the site design, when the system does not ask for light', () => {
    expect(resolveThemeMode(null, false)).toBe('dark');
  });

  it('ignores a stored value that is not a theme', () => {
    expect(resolveThemeMode('purple', false)).toBe('dark');
    expect(resolveThemeMode('purple', true)).toBe('light');
  });
});
