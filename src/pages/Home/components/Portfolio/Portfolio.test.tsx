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

  it('shows Foodiary with front end and API links and no website link', async () => {
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

  describe('screenshot gallery', () => {
    it('shows Gazer with a caption and one thumbnail per screenshot instead of a placeholder', () => {
      renderWithProviders(<Portfolio id='portfolio' />);
      const card = within(activeProject());

      const thumbs = card.getByRole('list', { name: 'Screenshots' });
      expect(within(thumbs).getAllByRole('button')).toHaveLength(6);
      expect(card.getByText(/Dashboard with portfolio value/)).toBeInTheDocument();
      expect(card.queryByRole('img', { name: 'Screenshots coming soon' })).toBeNull();
    });

    it('marks the first thumbnail as the current one', () => {
      renderWithProviders(<Portfolio id='portfolio' />);
      const thumbs = within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button');

      expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true');
      expect(thumbs[1]).toHaveAttribute('aria-pressed', 'false');
    });

    it('switches the shown screenshot and its caption when a thumbnail is chosen', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      const thumbs = within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button');

      await user.click(thumbs[2]);

      expect(thumbs[2]).toHaveAttribute('aria-pressed', 'true');
      expect(thumbs[0]).toHaveAttribute('aria-pressed', 'false');
      expect(within(activeProject()).getByText(/Events feed with volume and liquidity/)).toBeInTheDocument();
      expect(within(activeProject()).queryByText(/Dashboard with portfolio value/)).toBeNull();
    });

    it('opens the modal with the chosen screenshot and its caption as the description', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      const thumbs = within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button');
      await user.click(thumbs[1]);

      await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Gazer' }));

      const dialog = screen.getByRole('dialog', { name: 'Image preview' });
      expect(within(dialog).getByRole('img', { name: /AI directives table/ })).toBeInTheDocument();
    });

    it('starts from the first screenshot again when returning to a project', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      await user.click(within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button')[3]);

      await user.click(screen.getByRole('button', { name: 'Next project' }));
      await user.click(screen.getByRole('button', { name: 'Previous project' }));

      const thumbs = within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button');
      expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true');
    });

    it('gives BR.Money two screenshots', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);

      await user.click(screen.getByRole('button', { name: 'Next project' }));

      expect(activeProjectName()).toBe('BR.Money');
      expect(within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button')).toHaveLength(2);
      expect(within(activeProject()).getByText(/Admin dashboard with net balance/)).toBeInTheDocument();
    });

    describe('Foodiary (portrait phone screenshots)', () => {
      async function goToFoodiary(): Promise<ReturnType<typeof userEvent.setup>> {
        const user = userEvent.setup();
        renderWithProviders(<Portfolio id='portfolio' />);
        await user.click(screen.getByRole('button', { name: 'Next project' }));
        await user.click(screen.getByRole('button', { name: 'Next project' }));
        return user;
      }

      it('shows five screenshots with captions instead of a placeholder', async () => {
        await goToFoodiary();
        const card = within(activeProject());

        expect(activeProjectName()).toBe('Foodiary');
        expect(within(card.getByRole('list', { name: 'Screenshots' })).getAllByRole('button')).toHaveLength(5);
        expect(card.getByText(/Welcome screen/)).toBeInTheDocument();
        expect(card.queryByRole('img', { name: 'Screenshots coming soon' })).toBeNull();
      });

      it('marks the card as portrait so the frame fits a phone screen', async () => {
        await goToFoodiary();

        expect(activeProject()).toHaveAttribute('data-orientation', 'portrait');
      });

      it('leaves landscape projects in the landscape frame', () => {
        renderWithProviders(<Portfolio id='portfolio' />);

        expect(activeProject()).toHaveAttribute('data-orientation', 'landscape');
      });

      it('opens the enlarged view in portrait mode with the chosen caption', async () => {
        const user = await goToFoodiary();
        await user.click(within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button')[3]);

        await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Foodiary' }));

        const dialog = screen.getByRole('dialog', { name: 'Image preview' });
        expect(dialog).toHaveAttribute('data-orientation', 'portrait');
        expect(within(dialog).getByRole('img', { name: /Home screen/ })).toBeInTheDocument();
      });

      it('ends on the AI meal breakdown, with the food-by-food nutrition', async () => {
        const user = await goToFoodiary();
        const thumbs = within(screen.getByRole('list', { name: 'Screenshots' })).getAllByRole('button');

        await user.click(thumbs[4]);

        expect(thumbs[4]).toHaveAttribute('aria-pressed', 'true');
        expect(within(activeProject()).getByText(/Meal detail with the nutrition breakdown/)).toBeInTheDocument();
      });

      it('keeps the enlarged view of a landscape project in landscape mode', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Portfolio id='portfolio' />);

        await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Gazer' }));

        expect(screen.getByRole('dialog')).toHaveAttribute('data-orientation', 'landscape');
      });

      it('translates the captions', async () => {
        await goToFoodiary();

        await i18n.changeLanguage('pt-BR');

        expect(await within(activeProject()).findByText(/Tela de boas-vindas/)).toBeInTheDocument();
      });
    });

    it('shows no thumbnails or caption for a single-screenshot project', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      await user.click(screen.getByRole('button', { name: 'Previous project' }));

      expect(activeProjectName()).toBe('Github Search');
      expect(within(activeProject()).queryByRole('list', { name: 'Screenshots' })).toBeNull();
      expect(within(activeProject()).getByRole('button', { name: 'Enlarge screenshot of Github Search' })).toBeInTheDocument();
    });

    it('translates the captions and the thumbnail list', async () => {
      renderWithProviders(<Portfolio id='portfolio' />);

      await i18n.changeLanguage('pt-BR');

      expect(await screen.findByRole('list', { name: 'Capturas de tela' })).toBeInTheDocument();
      expect(within(activeProject()).getByText(/Dashboard com valor do portfólio/)).toBeInTheDocument();
    });
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

    it('moves focus to the close button on open and cycles between it and the image area on Tab', async () => {
      const user = await openFincheckImage();
      const close = screen.getByRole('button', { name: 'Close image' });
      const imageArea = screen.getByRole('region', { name: /scroll to see all of it/i });

      expect(close).toHaveFocus();
      await user.tab();
      expect(imageArea).toHaveFocus();
      await user.tab();
      expect(close).toHaveFocus();
      await user.tab({ shift: true });
      expect(imageArea).toHaveFocus();
      await user.tab({ shift: true });
      expect(close).toHaveFocus();
    });

    it('keeps focus inside the dialog while tabbing', async () => {
      const user = await openFincheckImage();
      const dialog = screen.getByRole('dialog');

      for (let step = 0; step < 6; step += 1) {
        await user.tab();
        expect(dialog).toContainElement(document.activeElement as HTMLElement);
      }
    });

    it('makes the image area scrollable by keyboard so tall screenshots can be seen in full', async () => {
      await openFincheckImage();

      const imageArea = screen.getByRole('region', { name: /scroll to see all of it/i });

      expect(imageArea).toHaveAttribute('tabindex', '0');
      expect(within(imageArea).getByRole('img', { name: 'Screenshot of Fincheck' })).toBeInTheDocument();
    });

    it('does not close when the image itself is clicked, so it can be scrolled and dragged', async () => {
      const user = await openFincheckImage();

      await user.click(screen.getByRole('img', { name: 'Screenshot of Fincheck' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes when the dark area around the image is clicked', async () => {
      const user = await openFincheckImage();

      await user.click(screen.getByRole('region', { name: /scroll to see all of it/i }));

      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('describes the scrollable area in Portuguese too', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      await i18n.changeLanguage('pt-BR');
      await user.click(screen.getByRole('button', { name: 'Próximo projeto' }));
      await user.click(screen.getByRole('button', { name: 'Próximo projeto' }));
      await user.click(screen.getByRole('button', { name: 'Próximo projeto' }));
      await user.click(screen.getByRole('button', { name: 'Ampliar captura de tela de Fincheck' }));

      expect(screen.getByRole('region', { name: /role para ver por inteiro/i })).toBeInTheDocument();
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
