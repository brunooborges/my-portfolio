import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from '../../i18n';
import { renderWithProviders } from '../../test/renderWithProviders';
import ThemeToggle from '.';

describe('ThemeToggle', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('offers to switch to the light theme while the site is dark', () => {
    renderWithProviders(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('switches the theme on click and then offers the way back', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
  });

  it('remembers the choice for the next visit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('describes the action in Portuguese too', async () => {
    renderWithProviders(<ThemeToggle />);

    await i18n.changeLanguage('pt-BR');

    expect(await screen.findByRole('button', { name: 'Mudar para o tema claro' })).toBeInTheDocument();
  });

  it('keeps the icon out of the accessibility tree', () => {
    renderWithProviders(<ThemeToggle />);

    expect(screen.getByRole('button').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the action as visible text when asked to, as in the mobile menu', () => {
    renderWithProviders(<ThemeToggle withLabel />);

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toHaveTextContent('Switch to light theme');
  });

  it('shows no visible text by default, only the icon', () => {
    renderWithProviders(<ThemeToggle />);

    expect(screen.getByRole('button')).toHaveTextContent('');
  });
});
