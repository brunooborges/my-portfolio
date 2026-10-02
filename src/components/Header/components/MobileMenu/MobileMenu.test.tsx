import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from '../../../../i18n';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import MobileMenu from '.';

/** The toggle is display:none above the mobile breakpoint, where role/name queries return no name. */
function getToggle(): HTMLElement {
  return screen.getByLabelText('Menu', { selector: 'button' });
}

function getSidebar(): HTMLElement {
  return screen.getByText('Home').closest('.mobile-menu') as HTMLElement;
}

describe('MobileMenu', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('starts closed and exposes its state to assistive tech', () => {
    renderWithProviders(<MobileMenu />);

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the closed sidebar out of the tab order and the accessibility tree', () => {
    renderWithProviders(<MobileMenu />);

    expect(getSidebar()).toHaveAttribute('inert');
  });

  it('makes the sidebar interactive when open and links the toggle to it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);

    await user.click(getToggle());

    expect(getSidebar()).not.toHaveAttribute('inert');
    expect(getSidebar().id).not.toBe('');
    expect(getToggle()).toHaveAttribute('aria-controls', getSidebar().id);
  });

  it('uses anchor links to the sections and labels the landmark distinctly from the toggle', () => {
    renderWithProviders(<MobileMenu />);

    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '#about');
    expect(screen.getByLabelText('Mobile menu', { selector: 'nav' })).toBeInTheDocument();
  });

  it('opens and closes with the toggle button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    const toggle = getToggle();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when a section link is chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    await user.click(getToggle());

    await user.click(screen.getByText('Portfolio'));

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes with Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    await user.click(getToggle());

    await user.keyboard('{Escape}');

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false');
    expect(getToggle()).toHaveFocus();
  });

  it('closes when clicking outside the menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    const toggle = getToggle();
    await user.click(toggle);

    await user.click(document.body);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('leaves the language switcher to the header bar, so it is not duplicated in the menu', () => {
    renderWithProviders(<MobileMenu />);

    expect(screen.queryByRole('group', { name: 'Language', hidden: true })).toBeNull();
  });

  it('keeps the menu button above the open sidebar, so it stays visible as a close button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    const toggle = getToggle();
    await user.click(toggle);

    const toggleLayer = Number(window.getComputedStyle(toggle).zIndex);
    const sidebarLayer = Number(window.getComputedStyle(getSidebar()).zIndex);

    expect(toggleLayer).toBeGreaterThan(sidebarLayer);
  });

  it('closes when the window grows past the mobile breakpoint', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    const toggle = getToggle();
    await user.click(toggle);

    act(() => {
      window.innerWidth = 1024;
      fireEvent(window, new Event('resize'));
    });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the menu open on resize while still on a small screen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    const toggle = getToggle();
    await user.click(toggle);

    act(() => {
      window.innerWidth = 500;
      fireEvent(window, new Event('resize'));
    });

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
