import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { vi } from 'vitest';

import i18n from '../../i18n';
import { renderWithProviders } from '../../test/renderWithProviders';
import App from '.';

describe('App', () => {
  beforeEach(async () => {
    vi.stubEnv('VITE_VISITOR_API_URL', 'https://abc123.lambda-url.sa-east-1.on.aws');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 3, counted: true }) }));
    await i18n.changeLanguage('en-US');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('renders every section with the ids the navigation scrolls to', () => {
    const { container } = renderWithProviders(<App />);

    for (const id of ['intro', 'about', 'portfolio']) {
      expect(container.querySelector(`#${id}`), id).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { level: 1, name: 'Bruno Borges' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Full-Stack Developer' })).toBeInTheDocument();
  });

  it('navigates with real, keyboard-reachable anchor links to each section', () => {
    renderWithProviders(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main' });

    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#intro');
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(within(nav).getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '#portfolio');
  });

  it('scrolls to the section in the address when the site is opened on a direct link', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.location.hash = '#portfolio';

    const { container } = renderWithProviders(<App />);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(container.querySelector('#portfolio'));
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('links to the social profiles safely', () => {
    renderWithProviders(<App />);

    for (const name of ['LinkedIn profile', 'GitHub profile']) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('translates the header navigation and the document when switching language', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByText('About')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'PT - Português' })[0]);

    expect(await within(nav).findByText('Sobre')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.title).toBe('Bruno Borges - Desenvolvedor Full-Stack');
    expect(screen.getByRole('heading', { level: 2, name: 'Desenvolvedor Full-Stack' })).toBeInTheDocument();
  });

  it('shows the visitor counter in the footer', async () => {
    renderWithProviders(<App />);
    mockAllIsIntersecting(true);

    expect(await screen.findByText(/Visitors: 3$/)).toBeInTheDocument();
  });
});
