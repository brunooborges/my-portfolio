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

  it('leads the Gazer card with what the product does: trading without leaving the app', () => {
    renderWithProviders(<Portfolio id='portfolio' />);

    const highlights = within(within(activeProject()).getByRole('list', { name: 'Highlights' })).getAllByRole('listitem');

    expect(highlights).toHaveLength(4);
    expect(highlights[0]).toHaveTextContent(
      /trade on Polymarket \(or other platforms\) without leaving the app, through a trading gateway/,
    );
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

  it('draws the slide counter in readable text colors, not the faint tick color', () => {
    const { container } = renderWithProviders(<Portfolio id='portfolio' />);

    expect(container.querySelector('.total-slide')).toHaveStyle({ color: '#BEBEBE' });
    expect(container.querySelector('.current-slide')).toHaveStyle({ color: '#FFFFFF' });
  });

  it('loads the project screenshots lazily, as they sit below the first screen', () => {
    const { container } = renderWithProviders(<Portfolio id='portfolio' />);
    const images = container.querySelectorAll('.right-section img');

    expect(images.length).toBeGreaterThan(1);
    for (const image of images) {
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('decoding', 'async');
    }
  });

  it('keeps each experiment link on one line, so Live and Source never break in two', () => {
    renderWithProviders(<Portfolio id='portfolio' />);
    const experiments = screen.getByRole('region', { name: 'More experiments' });

    for (const link of within(experiments).getAllByRole('link')) {
      expect(window.getComputedStyle(link).whiteSpace, link.textContent ?? '').toBe('nowrap');
    }
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

  describe('screenshot navigation', () => {
    const FIRST = /Dashboard with portfolio value/;
    const SECOND = /AI directives table/;
    const LAST = /Sign-in screen with the product tagline/;

    function card(): ReturnType<typeof within> {
      return within(activeProject());
    }

    it('offers previous and next controls on the main image of a project with several screenshots', () => {
      renderWithProviders(<Portfolio id='portfolio' />);

      expect(card().getByRole('button', { name: 'Previous screenshot' })).toBeInTheDocument();
      expect(card().getByRole('button', { name: 'Next screenshot' })).toBeInTheDocument();
    });

    it('offers no such controls when a project has a single screenshot', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      await user.click(screen.getByRole('button', { name: 'Previous project' }));

      expect(activeProjectName()).toBe('Github Search');
      expect(card().queryByRole('button', { name: 'Next screenshot' })).toBeNull();
      expect(card().queryByRole('button', { name: 'Previous screenshot' })).toBeNull();
    });

    it('moves to the next screenshot, updating the caption and the current thumbnail', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);

      await user.click(card().getByRole('button', { name: 'Next screenshot' }));

      expect(card().getByText(SECOND)).toBeInTheDocument();
      expect(card().queryByText(FIRST)).toBeNull();
      const thumbs = within(card().getByRole('list', { name: 'Screenshots' })).getAllByRole('button');
      expect(thumbs[1]).toHaveAttribute('aria-pressed', 'true');
      expect(thumbs[0]).toHaveAttribute('aria-pressed', 'false');
    });

    it('wraps around: previous from the first goes to the last, next from the last goes to the first', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);

      await user.click(card().getByRole('button', { name: 'Previous screenshot' }));
      expect(card().getByText(LAST)).toBeInTheDocument();

      await user.click(card().getByRole('button', { name: 'Next screenshot' }));
      expect(card().getByText(FIRST)).toBeInTheDocument();
    });

    it('also works with the arrow keys from a thumbnail, without changing the project', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Portfolio id='portfolio' />);
      within(card().getByRole('list', { name: 'Screenshots' })).getAllByRole('button')[0].focus();

      await user.keyboard('{ArrowRight}');
      expect(card().getByText(SECOND)).toBeInTheDocument();

      await user.keyboard('{ArrowLeft}{ArrowLeft}');
      expect(card().getByText(LAST)).toBeInTheDocument();
      expect(activeProjectName()).toBe('Gazer');
    });

    it('announces the new caption politely to screen readers', () => {
      renderWithProviders(<Portfolio id='portfolio' />);

      expect(card().getByText(FIRST)).toHaveAttribute('aria-live', 'polite');
    });

    it('labels the controls in Portuguese too', async () => {
      renderWithProviders(<Portfolio id='portfolio' />);

      await i18n.changeLanguage('pt-BR');

      expect(await card().findByRole('button', { name: 'Captura anterior' })).toBeInTheDocument();
      expect(card().getByRole('button', { name: 'Próxima captura' })).toBeInTheDocument();
    });

    describe('in the enlarged view', () => {
      async function openEnlarged(): Promise<ReturnType<typeof userEvent.setup>> {
        const user = userEvent.setup();
        renderWithProviders(<Portfolio id='portfolio' />);
        await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Gazer' }));
        return user;
      }

      function dialog(): ReturnType<typeof within> {
        return within(screen.getByRole('dialog', { name: 'Image preview' }));
      }

      it('shows previous and next controls and where you are in the set', async () => {
        await openEnlarged();

        expect(dialog().getByRole('button', { name: 'Previous screenshot' })).toBeInTheDocument();
        expect(dialog().getByRole('button', { name: 'Next screenshot' })).toBeInTheDocument();
        expect(dialog().getByText('Image 1 of 6')).toBeInTheDocument();
      });

      it('shows the next image with its own description when Next is chosen', async () => {
        const user = await openEnlarged();

        await user.click(dialog().getByRole('button', { name: 'Next screenshot' }));

        expect(dialog().getByRole('img', { name: SECOND })).toBeInTheDocument();
        expect(dialog().getByText('Image 2 of 6')).toBeInTheDocument();
      });

      it('moves with the arrow keys and wraps around', async () => {
        const user = await openEnlarged();

        await user.keyboard('{ArrowLeft}');
        expect(dialog().getByRole('img', { name: LAST })).toBeInTheDocument();
        expect(dialog().getByText('Image 6 of 6')).toBeInTheDocument();

        await user.keyboard('{ArrowRight}');
        expect(dialog().getByRole('img', { name: FIRST })).toBeInTheDocument();
      });

      it('leaves the project card on the image that was last viewed', async () => {
        const user = await openEnlarged();
        await user.click(dialog().getByRole('button', { name: 'Next screenshot' }));
        await user.click(dialog().getByRole('button', { name: 'Next screenshot' }));

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).toBeNull();
        const thumbs = within(card().getByRole('list', { name: 'Screenshots' })).getAllByRole('button');
        expect(thumbs[2]).toHaveAttribute('aria-pressed', 'true');
      });

      it('keeps the keyboard inside the dialog, taking in the new controls', async () => {
        const user = await openEnlarged();
        const close = screen.getByRole('button', { name: 'Close image' });
        const previous = dialog().getByRole('button', { name: 'Previous screenshot' });
        const next = dialog().getByRole('button', { name: 'Next screenshot' });
        const imageArea = screen.getByRole('region', { name: /scroll to see all of it/i });

        expect(close).toHaveFocus();
        await user.tab();
        expect(previous).toHaveFocus();
        await user.tab();
        expect(next).toHaveFocus();
        await user.tab();
        expect(imageArea).toHaveFocus();
        await user.tab();
        expect(close).toHaveFocus();
        await user.tab({ shift: true });
        expect(imageArea).toHaveFocus();
      });

      it('starts the next image from its top, so a tall one is not left scrolled', async () => {
        const user = await openEnlarged();
        const imageArea = screen.getByRole('region', { name: /scroll to see all of it/i });
        imageArea.scrollTop = 500;

        await user.click(dialog().getByRole('button', { name: 'Next screenshot' }));

        expect(imageArea.scrollTop).toBe(0);
      });

      it('has no previous or next controls for a project with one screenshot', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Portfolio id='portfolio' />);
        await user.click(screen.getByRole('button', { name: 'Previous project' }));

        await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Github Search' }));

        expect(dialog().queryByRole('button', { name: 'Next screenshot' })).toBeNull();
        expect(dialog().queryByText(/Image \d+ of \d+/)).toBeNull();
      });

      it('works for the portrait phone screenshots too', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Portfolio id='portfolio' />);
        await user.click(screen.getByRole('button', { name: 'Next project' }));
        await user.click(screen.getByRole('button', { name: 'Next project' }));
        await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Foodiary' }));

        await user.click(dialog().getByRole('button', { name: 'Next screenshot' }));

        expect(screen.getByRole('dialog')).toHaveAttribute('data-orientation', 'portrait');
        expect(dialog().getByText('Image 2 of 5')).toBeInTheDocument();
        expect(dialog().getByRole('img', { name: /Onboarding step: choosing a goal/ })).toBeInTheDocument();
      });

      it('describes the controls and the counter in Portuguese', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Portfolio id='portfolio' />);
        await user.click(screen.getByRole('button', { name: 'Enlarge screenshot of Gazer' }));

        await i18n.changeLanguage('pt-BR');

        const translated = within(await screen.findByRole('dialog', { name: 'Visualização da imagem' }));
        expect(translated.getByRole('button', { name: 'Próxima captura' })).toBeInTheDocument();
        expect(translated.getByText('Imagem 1 de 6')).toBeInTheDocument();
      });
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
