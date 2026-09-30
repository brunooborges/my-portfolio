import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from '../../../../i18n';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import Portfolio from '.';

function activeProject(): HTMLElement {
  return screen.getByRole('article');
}

function activeProjectName(): string {
  return within(activeProject()).getByRole('heading', { level: 3 }).textContent ?? '';
}

describe('Portfolio', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('starts on the first featured project and announces the position', () => {
    renderWithProviders(<Portfolio id='portfolio' />);

    expect(activeProjectName()).toBe('Gazer');
    expect(screen.getByRole('status')).toHaveTextContent('Project 1 of 6');
  });

  it('renders the section with the id used by the navigation', () => {
    const { container } = renderWithProviders(<Portfolio id='portfolio' />);

    expect(container.querySelector('section#portfolio')).toBeInTheDocument();
  });

  it('moves to the next and previous project with the buttons', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);

    await user.click(screen.getByRole('button', { name: 'Next project' }));
    expect(activeProjectName()).toBe('BR.Money');

    await user.click(screen.getByRole('button', { name: 'Previous project' }));
    expect(activeProjectName()).toBe('Gazer');
  });

  it('wraps around at both ends', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);

    await user.click(screen.getByRole('button', { name: 'Previous project' }));
    expect(activeProjectName()).toBe('Github Search');
    expect(screen.getByRole('status')).toHaveTextContent('Project 6 of 6');

    await user.click(screen.getByRole('button', { name: 'Next project' }));
    expect(activeProjectName()).toBe('Gazer');
  });

  it('supports the arrow keys', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);

    screen.getByRole('button', { name: 'Next project' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(activeProjectName()).toBe('BR.Money');

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(activeProjectName()).toBe('Github Search');
  });

  it('jumps to the first and last project with Home and End', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);
    screen.getByRole('button', { name: 'Next project' }).focus();

    await user.keyboard('{End}');
    expect(activeProjectName()).toBe('Github Search');
    expect(screen.getByRole('status')).toHaveTextContent('Project 6 of 6');

    await user.keyboard('{Home}');
    expect(activeProjectName()).toBe('Gazer');
    expect(screen.getByRole('status')).toHaveTextContent('Project 1 of 6');
  });

  it('marks company projects as private and offers no source or live links', () => {
    renderWithProviders(<Portfolio id='portfolio' />);

    expect(within(activeProject()).getByText('Company project')).toBeInTheDocument();
    expect(within(activeProject()).queryAllByRole('link')).toHaveLength(0);
  });

  it('offers front end, back end and live links for a public full-stack project', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);

    await user.click(screen.getByRole('button', { name: 'Next project' }));
    await user.click(screen.getByRole('button', { name: 'Next project' }));

    await user.click(screen.getByRole('button', { name: 'Next project' }));

    expect(activeProjectName()).toBe('Fincheck');
    expect(screen.getByRole('link', { name: 'Front end code' })).toHaveAttribute(
      'href',
      'https://github.com/brunooborges/my-fincheck-frontend',
    );
    expect(screen.getByRole('link', { name: 'Back end code' })).toHaveAttribute(
      'href',
      'https://github.com/brunooborges/my-fincheck-api',
    );
    expect(screen.getByRole('link', { name: 'Visit website' })).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('shows Foodiary with front end and API links, a placeholder and no website link', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);

    await user.click(screen.getByRole('button', { name: 'Next project' }));
    await user.click(screen.getByRole('button', { name: 'Next project' }));

    expect(activeProjectName()).toBe('Foodiary');
    const card = within(activeProject());
    expect(card.getByRole('link', { name: 'Front end code' })).toHaveAttribute(
      'href',
      'https://github.com/brunooborges/foodiary-frontend',
    );
    expect(card.getByRole('link', { name: 'Back end code' })).toHaveAttribute(
      'href',
      'https://github.com/brunooborges/foodiary-api',
    );
    expect(card.queryByRole('link', { name: 'Visit website' })).toBeNull();
    expect(card.queryByText('Company project')).toBeNull();
    expect(card.getByText(/JStack Lab course/)).toBeInTheDocument();
  });

  it('shows a single source link for a single-repository project', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);

    await user.click(screen.getByRole('button', { name: 'Previous project' }));

    expect(activeProjectName()).toBe('Github Search');
    expect(within(activeProject()).getByRole('link', { name: 'Source code' })).toBeInTheDocument();
    expect(within(activeProject()).queryByRole('link', { name: 'Back end code' })).toBeNull();
  });

  it('lists the small experiments with live and source links', () => {
    renderWithProviders(<Portfolio id='portfolio' />);

    const experiments = screen.getByRole('region', { name: 'More experiments' });
    const items = within(experiments).getAllByRole('listitem');

    expect(items).toHaveLength(4);
    expect(within(items[0]).getByText('Tic-tac-toe')).toBeInTheDocument();
    expect(within(items[0]).getByRole('link', { name: 'Tic-tac-toe: Live' })).toHaveAttribute(
      'href',
      'https://brunooborges.github.io/tic-tac-toe/',
    );
    expect(within(items[0]).getByRole('link', { name: 'Tic-tac-toe: Source' })).toBeInTheDocument();
  });

  it('translates the section when the language changes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portfolio id='portfolio' />);

    await i18n.changeLanguage('pt-BR');

    expect(await screen.findByRole('button', { name: 'Próximo projeto' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Projeto 1 de 6');
    expect(screen.getByText('Projeto de empresa')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Próximo projeto' }));
    expect(activeProjectName()).toBe('BR.Money');
  });

  describe('image modal', () => {
    async function openFincheckImage(): Promise<ReturnType<typeof userEvent.setup>> {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      await user.click(screen.getByRole('button', { name: 'Next project' }));
      await user.click(screen.getByRole('button', { name: 'Next project' }));
      await user.click(screen.getByRole('button', { name: 'Next project' }));
      await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Fincheck' }));
      return user;
    }

    it('opens a dialog with the screenshot', async () => {
      await openFincheckImage();

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close image' })).toBeInTheDocument();
    });

    it('closes with the close button', async () => {
      const user = await openFincheckImage();

      await user.click(screen.getByRole('button', { name: 'Close image' }));

      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('closes with Escape', async () => {
      const user = await openFincheckImage();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('has its own title and a translated image description', async () => {
      await openFincheckImage();

      const dialog = screen.getByRole('dialog', { name: 'Image preview' });
      expect(within(dialog).getByRole('img', { name: 'Screenshot of Fincheck' })).toBeInTheDocument();
    });

    it('moves focus to the close button on open and keeps it there on Tab', async () => {
      const user = await openFincheckImage();
      const close = screen.getByRole('button', { name: 'Close image' });

      expect(close).toHaveFocus();
      await user.tab();
      expect(close).toHaveFocus();
      await user.tab({ shift: true });
      expect(close).toHaveFocus();
    });

    it('returns focus to the screenshot button that opened it', async () => {
      const user = await openFincheckImage();

      await user.keyboard('{Escape}');

      expect(screen.getByRole('button', { name: 'Enlarge screenshot of Fincheck' })).toHaveFocus();
    });

    it('locks page scrolling while open and restores it afterwards', async () => {
      const user = await openFincheckImage();
      expect(document.body.style.overflow).toBe('hidden');

      await user.keyboard('{Escape}');

      expect(document.body.style.overflow).toBe('');
    });

    it('translates the image description', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      await i18n.changeLanguage('pt-BR');
      await user.click(screen.getByRole('button', { name: 'Próximo projeto' }));
      await user.click(screen.getByRole('button', { name: 'Próximo projeto' }));
      await user.click(screen.getByRole('button', { name: 'Próximo projeto' }));
      await user.click(screen.getByRole('button', { name: 'Ampliar captura de tela de Fincheck' }));

      const dialog = screen.getByRole('dialog', { name: 'Visualização da imagem' });
      expect(within(dialog).getByRole('img', { name: 'Captura de tela de Fincheck' })).toBeInTheDocument();
    });
  });
});
