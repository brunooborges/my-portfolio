import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from '../../i18n';
import { renderWithProviders } from '../../test/renderWithProviders';
import Header from '.';

const PHONE_WIDTH = 400;
const DESKTOP_WIDTH = 1280;

/** happy-dom exposes its own controls on `window`; the media queries follow the viewport. */
type HappyDomWindow = Window & { happyDOM: { setViewport: (viewport: { width: number; height: number }) => void } };

function setViewportWidth(width: number): void {
  (window as unknown as HappyDomWindow).happyDOM.setViewport({ width, height: 800 });
}

/** True when the element or any ancestor is removed from layout with `display: none`. */
function isDisplayNone(element: HTMLElement): boolean {
  for (let node: HTMLElement | null = element; node !== null; node = node.parentElement) {
    if (window.getComputedStyle(node).display === 'none') {
      return true;
    }
  }
  return false;
}

describe('Header language switcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  afterEach(() => {
    setViewportWidth(DESKTOP_WIDTH);
  });

  it.each([
    ['on desktop', DESKTOP_WIDTH],
    ['on a phone', PHONE_WIDTH],
  ])('has exactly one switcher, visible in the header bar %s', (_label, width) => {
    setViewportWidth(width);
    renderWithProviders(<Header />);

    const groups = screen.getAllByRole('group', { name: 'Language', hidden: true });

    expect(groups).toHaveLength(1);
    expect(isDisplayNone(groups[0])).toBe(false);
  });

  it('keeps the switcher reachable without opening the mobile menu', () => {
    setViewportWidth(PHONE_WIDTH);
    renderWithProviders(<Header />);

    expect(screen.getByRole('button', { name: 'PT - Português' })).toBeVisible();
  });
});

describe('Header theme toggle', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  afterEach(() => {
    setViewportWidth(DESKTOP_WIDTH);
  });

  function visibleToggles(): HTMLElement[] {
    return screen
      .getAllByRole('button', { name: /Switch to (light|dark) theme/, hidden: true })
      .filter((toggle) => !isDisplayNone(toggle));
  }

  it('shows one toggle in the header bar on desktop', () => {
    setViewportWidth(DESKTOP_WIDTH);
    renderWithProviders(<Header />);

    const toggles = visibleToggles();

    expect(toggles).toHaveLength(1);
    expect(toggles[0].closest('nav')).toBeNull();
  });

  it('moves the toggle into the mobile menu on a phone, where the bar is full', async () => {
    setViewportWidth(PHONE_WIDTH);
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    await user.click(screen.getByLabelText('Menu', { selector: 'button' }));

    const toggles = visibleToggles();

    expect(toggles).toHaveLength(1);
    expect(toggles[0].closest('nav')).toBe(screen.getByLabelText('Mobile menu', { selector: 'nav' }));
    expect(toggles[0]).toHaveTextContent('Switch to light theme');
  });

  it('keeps the menu open when the theme is switched from inside it', async () => {
    setViewportWidth(PHONE_WIDTH);
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const menuButton = screen.getByLabelText('Menu', { selector: 'button' });
    await user.click(menuButton);

    await user.click(visibleToggles()[0]);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(visibleToggles()[0]).toHaveTextContent('Switch to dark theme');
  });
});

describe('Header backdrop', () => {
  function scrollTo(y: number): void {
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
  }

  beforeEach(async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    await i18n.changeLanguage('en-US');
  });

  it('is see-through at the top of the page', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('banner')).not.toHaveStyle({ backgroundColor: '#121212' });
  });

  it('gets a solid page-colored backdrop once scrolled, so the links never sit on top of content', () => {
    renderWithProviders(<Header />);

    scrollTo(400);

    expect(screen.getByRole('banner')).toHaveStyle({ backgroundColor: '#121212' });
  });

  it('is see-through again when scrolling back to the top', () => {
    renderWithProviders(<Header />);
    scrollTo(400);

    scrollTo(0);

    expect(screen.getByRole('banner')).not.toHaveStyle({ backgroundColor: '#121212' });
  });

  it('takes the light page color in the light theme', () => {
    window.localStorage.setItem('theme', 'light');
    renderWithProviders(<Header />);

    scrollTo(400);

    expect(screen.getByRole('banner')).toHaveStyle({ backgroundColor: '#F4F4F8' });
  });
});
