import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import enUS from '../../i18n/locales/en-US.json';
import ptBR from '../../i18n/locales/pt-BR.json';
import i18n from '../../i18n';
import { renderWithProviders } from '../../test/renderWithProviders';
import Portfolio from '../../pages/Home/components/Portfolio';

const SLIDES_TO_PROJECT = { Gazer: 0, 'BR.Money': 1, Foodiary: 2, Fincheck: 3 } as const;

async function goTo(name: keyof typeof SLIDES_TO_PROJECT): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup();
  renderWithProviders(<Portfolio id='portfolio' />);
  for (let step = 0; step < SLIDES_TO_PROJECT[name]; step += 1) {
    await user.click(screen.getByRole('button', { name: 'Next project' }));
  }
  return user;
}

function dialog(): ReturnType<typeof within> {
  return within(screen.getByRole('dialog'));
}

describe('case studies', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it.each(['Gazer', 'BR.Money', 'Foodiary'] as const)('offers a case study for %s', async (name) => {
    await goTo(name);

    expect(within(screen.getByRole('article')).getByRole('button', { name: 'Case study' })).toBeInTheDocument();
  });

  it('offers none for a project without one', async () => {
    await goTo('Fincheck');

    expect(within(screen.getByRole('article')).queryByRole('button', { name: 'Case study' })).toBeNull();
  });

  it('opens a dialog named after the project, with the four parts of the story', async () => {
    const user = await goTo('Gazer');

    await user.click(screen.getByRole('button', { name: 'Case study' }));

    expect(screen.getByRole('dialog', { name: /Gazer/ })).toBeInTheDocument();
    for (const heading of ['The problem', 'My role', 'How it works', 'The result']) {
      expect(dialog().getByRole('heading', { level: 3, name: heading })).toBeInTheDocument();
    }
  });

  it('lists the steps in order, each with a title and a short explanation', async () => {
    const user = await goTo('Foodiary');

    await user.click(screen.getByRole('button', { name: 'Case study' }));

    const steps = within(dialog().getByRole('list', { name: 'How it works, step by step' })).getAllByRole('listitem');
    expect(steps).toHaveLength(enUS.caseStudies.foodiary.flowTitles.length);
    expect(steps[0]).toHaveTextContent(enUS.caseStudies.foodiary.flowTitles[0]);
    expect(steps[0]).toHaveTextContent(enUS.caseStudies.foodiary.flowDetails[0]);
  });

  it('tells the Foodiary pipeline: pre-signed upload, S3, a queue, a worker and the AI step', async () => {
    const user = await goTo('Foodiary');

    await user.click(screen.getByRole('button', { name: 'Case study' }));

    const text = dialog().getByRole('list', { name: 'How it works, step by step' }).textContent ?? '';
    for (const word of ['pre-signed', 'S3', 'SQS', 'dead-letter', 'PostgreSQL']) {
      expect(text, word).toContain(word);
    }
  });

  it('tells that Gazer users can trade on Polymarket without leaving Gazer, through BR.Money', async () => {
    const user = await goTo('Gazer');

    await user.click(screen.getByRole('button', { name: 'Case study' }));

    const steps = dialog().getByRole('list', { name: 'How it works, step by step' });
    const trading = within(steps).getByText('Trading without leaving Gazer').closest('li') as HTMLElement;
    expect(trading).toHaveTextContent(
      /trade on Polymarket markets \(or other prediction-market platforms\) without ever leaving Gazer/,
    );
    expect(trading).toHaveTextContent(/trading gateway, like BR\.Money/);
    expect(trading).toHaveTextContent(/wallet and the orders/);
  });

  it('connects BR.Money back to Gazer in its order-queue step', async () => {
    const user = await goTo('BR.Money');

    await user.click(screen.getByRole('button', { name: 'Case study' }));

    const steps = dialog().getByRole('list', { name: 'How it works, step by step' });
    const orders = within(steps).getByText('One order at a time').closest('li') as HTMLElement;
    expect(orders).toHaveTextContent(/including the Polymarket trades that Gazer sends/);
    expect(orders).toHaveTextContent(/same money can never be spent twice/);
  });

  it('puts the trading step right after the live prices it builds on', async () => {
    const user = await goTo('Gazer');

    await user.click(screen.getByRole('button', { name: 'Case study' }));

    const titles = within(dialog().getByRole('list', { name: 'How it works, step by step' }))
      .getAllByRole('listitem')
      .map((item) => item.querySelector('strong')?.textContent);
    expect(titles.indexOf('Trading without leaving Gazer')).toBe(titles.indexOf('Live prices') + 1);
  });

  it('closes with the close button, Escape and a click on the dark area', async () => {
    const user = await goTo('Gazer');
    const opener = screen.getByRole('button', { name: 'Case study' });

    await user.click(opener);
    await user.click(dialog().getByRole('button', { name: 'Close case study' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(opener);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(opener);
    await user.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not close when the text itself is clicked, so it can be selected', async () => {
    const user = await goTo('Gazer');
    await user.click(screen.getByRole('button', { name: 'Case study' }));

    await user.click(dialog().getByRole('heading', { level: 3, name: 'The problem' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('moves focus in, keeps it inside while tabbing, and gives it back to the button on close', async () => {
    const user = await goTo('Gazer');
    const opener = screen.getByRole('button', { name: 'Case study' });
    await user.click(opener);
    const close = dialog().getByRole('button', { name: 'Close case study' });
    const body = dialog().getByRole('region', { name: /Gazer/ });

    expect(close).toHaveFocus();
    await user.tab();
    expect(body).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(body).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(opener).toHaveFocus();
  });

  it('locks page scrolling while open and restores it afterwards', async () => {
    const user = await goTo('Gazer');

    await user.click(screen.getByRole('button', { name: 'Case study' }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('');
  });

  it('is available in Portuguese', async () => {
    const user = await goTo('BR.Money');

    await i18n.changeLanguage('pt-BR');
    await user.click(await screen.findByRole('button', { name: 'Estudo de caso' }));

    const translated = within(screen.getByRole('dialog'));
    expect(translated.getByRole('heading', { level: 3, name: 'O problema' })).toBeInTheDocument();
    expect(translated.getByText(new RegExp(ptBR.caseStudies.brmoney.outcome.slice(0, 30)))).toBeInTheDocument();
  });
});

describe('case study content', () => {
  const locales = { 'en-US': enUS, 'pt-BR': ptBR } as const;

  it.each(Object.entries(locales))('has the same complete story for every project in %s', (_code, locale) => {
    for (const [slug, study] of Object.entries(locale.caseStudies)) {
      expect(study.problem.trim(), slug).not.toBe('');
      expect(study.role.trim(), slug).not.toBe('');
      expect(study.outcome.trim(), slug).not.toBe('');
      expect(study.flowTitles.length, slug).toBeGreaterThanOrEqual(4);
      expect(study.flowDetails, slug).toHaveLength(study.flowTitles.length);
    }
  });

  it.each([
    [
      'en-US',
      enUS,
      /trade on Polymarket markets \(or other prediction-market platforms\) without ever leaving Gazer/,
      /BR\.Money/,
    ],
    [
      'pt-BR',
      ptBR,
      /operar nos mercados da Polymarket \(ou de outras plataformas de mercados de previsão\) sem nunca sair do Gazer/,
      /BR\.Money/,
    ],
  ])('says in %s that trading on Polymarket happens inside Gazer, through BR.Money', (_code, locale, claim, gateway) => {
    const text = locale.caseStudies.gazer.flowDetails.join(' ');

    expect(text).toMatch(claim);
    expect(text).toMatch(gateway);
    expect(locale.caseStudies.gazer.outcome.length).toBeGreaterThan(0);
  });

  it.each([
    ['en-US', enUS, /Polymarket trades that Gazer sends/],
    ['pt-BR', ptBR, /operações na Polymarket que o Gazer envia/],
  ])('links BR.Money to Gazer in %s', (_code, locale, link) => {
    expect(locale.caseStudies.brmoney.flowDetails.join(' ')).toMatch(link);
  });

  // Deliberately generic: this repository is public, so the guard must not list the vendors it keeps out.
  it('stays at architecture level: no links, secrets, credentials or local paths', () => {
    const forbidden = /\.env|api[- ]?key|password|secret|certificate|token|localhost|https?:\/\/|@\w+\.\w+/i;
    const everything = JSON.stringify([enUS.caseStudies, ptBR.caseStudies]);

    expect(everything.match(forbidden)?.[0] ?? null).toBeNull();
  });

  it('only claims the figures already stated in the About section and the public resume', () => {
    const text = JSON.stringify(enUS.caseStudies);
    const figures = text.match(/\d+(\+|%)?/g) ?? [];
    const allowed = new Set(['21', '40', '70%', '100', '170+', '50%', '3']);

    expect(figures.filter((figure) => !allowed.has(figure))).toEqual([]);
  });
});
