import { DEFAULT_LANGUAGE, resolveLanguage, SUPPORTED_LANGUAGES } from './languages';

describe('resolveLanguage', () => {
  it('returns a supported language untouched', () => {
    expect(resolveLanguage('en-US')).toBe('en-US');
    expect(resolveLanguage('pt-BR')).toBe('pt-BR');
  });

  it('maps any Portuguese variant to pt-BR', () => {
    expect(resolveLanguage('pt')).toBe('pt-BR');
    expect(resolveLanguage('pt-PT')).toBe('pt-BR');
    expect(resolveLanguage('PT-br')).toBe('pt-BR');
  });

  it('maps any English variant to en-US', () => {
    expect(resolveLanguage('en')).toBe('en-US');
    expect(resolveLanguage('en-GB')).toBe('en-US');
  });

  it('falls back to the default language for unknown or empty input', () => {
    expect(resolveLanguage('fr-FR')).toBe(DEFAULT_LANGUAGE);
    expect(resolveLanguage('')).toBe(DEFAULT_LANGUAGE);
    expect(resolveLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
    expect(resolveLanguage(null)).toBe(DEFAULT_LANGUAGE);
  });

  it('only exposes en-US and pt-BR', () => {
    expect([...SUPPORTED_LANGUAGES]).toEqual(['en-US', 'pt-BR']);
    expect(DEFAULT_LANGUAGE).toBe('en-US');
  });
});
