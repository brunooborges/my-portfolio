import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from '../../i18n';
import { renderWithProviders } from '../../test/renderWithProviders';
import LanguageSwitcher from '.';

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('marks the current language as pressed', () => {
    renderWithProviders(<LanguageSwitcher />);

    expect(screen.getByRole('button', { name: 'EN - English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'PT - Português' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches to pt-BR and persists the choice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: 'PT - Português' }));

    expect(i18n.resolvedLanguage).toBe('pt-BR');
    expect(window.localStorage.getItem('lang')).toBe('pt-BR');
    expect(screen.getByRole('button', { name: 'PT - Português' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not store the auto-detected language, only an explicit choice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);
    expect(window.localStorage.getItem('lang')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'PT - Português' }));

    expect(window.localStorage.getItem('lang')).toBe('pt-BR');
  });

  it('still switches language when storage is unavailable', async () => {
    const user = userEvent.setup();
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: 'PT - Português' }));

    expect(i18n.resolvedLanguage).toBe('pt-BR');
    setItem.mockRestore();
  });

  it('exposes a translated group label', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'PT - Português' }));

    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument();
  });
});
