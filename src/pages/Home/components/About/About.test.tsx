import { screen, within } from '@testing-library/react';

import enUS from '../../../../i18n/locales/en-US.json';
import ptBR from '../../../../i18n/locales/pt-BR.json';
import i18n from '../../../../i18n';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import About from '.';

describe('About', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('renders the section with the id used by the navigation', () => {
    const { container } = renderWithProviders(<About id='about' />);

    expect(container.querySelector('section#about')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
  });

  it('renders every en-US paragraph as its own element', () => {
    const { container } = renderWithProviders(<About id='about' />);

    const paragraphs = container.querySelectorAll('.slide-from-left p');
    expect(paragraphs).toHaveLength(enUS.about.paragraphs.length);
    enUS.about.paragraphs.forEach((text, index) => {
      expect(paragraphs[index]).toHaveTextContent(text);
    });
  });

  it('renders every pt-BR paragraph after switching language', async () => {
    const { container } = renderWithProviders(<About id='about' />);

    await i18n.changeLanguage('pt-BR');

    expect(await screen.findByRole('heading', { level: 2, name: 'Sobre' })).toBeInTheDocument();
    const paragraphs = container.querySelectorAll('.slide-from-left p');
    expect(paragraphs).toHaveLength(ptBR.about.paragraphs.length);
    expect(paragraphs[0]).toHaveTextContent(ptBR.about.paragraphs[0]);
  });

  it('uses the corrected figures and the Foodiary course attribution', () => {
    renderWithProviders(<About id='about' />);

    expect(screen.getByText(/40-module NestJS and Prisma backend/)).toBeInTheDocument();
    expect(screen.getByText(/170\+ reusable components/)).toBeInTheDocument();
    expect(screen.getByText(/while following the JStack Lab course/)).toBeInTheDocument();
  });

  it('loads the portrait lazily, with its size declared so the page does not jump', () => {
    renderWithProviders(<About id='about' />);

    const photo = screen.getByRole('img', { name: 'Portrait of Bruno Borges' });

    expect(photo).toHaveAttribute('loading', 'lazy');
    expect(photo).toHaveAttribute('decoding', 'async');
    expect(photo).toHaveAttribute('width', '600');
    expect(photo).toHaveAttribute('height', '600');
    expect(photo.getAttribute('src')).toMatch(/.webp$/);
  });

  it('keeps the portrait square: the width attribute must not stretch it against the CSS height', () => {
    renderWithProviders(<About id='about' />);

    const photo = screen.getByRole('img', { name: 'Portrait of Bruno Borges' });

    expect(window.getComputedStyle(photo).width).toBe('auto');
  });

  it('shows the core stack tiles', () => {
    renderWithProviders(<About id='about' />);

    const stack = screen.getByRole('list', { name: 'Core stack' });
    const labels = within(stack)
      .getAllByRole('listitem')
      .map((item) => item.textContent);

    expect(labels).toEqual([
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'Tailwind',
      'AWS',
    ]);
  });

  it('describes the portrait in the active language', async () => {
    renderWithProviders(<About id='about' />);
    expect(screen.getByRole('img', { name: 'Portrait of Bruno Borges' })).toBeInTheDocument();

    await i18n.changeLanguage('pt-BR');

    expect(await screen.findByRole('img', { name: 'Retrato de Bruno Borges' })).toBeInTheDocument();
  });
});
