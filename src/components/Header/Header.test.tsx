import { screen } from '@testing-library/react';

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
