import { renderHook } from '@testing-library/react';

import useScrollToHash from './useScrollToHash';

function addSection(id: string): HTMLElement {
  const section = document.createElement('section');
  section.id = id;
  section.scrollIntoView = vi.fn();
  document.body.appendChild(section);
  return section;
}

describe('useScrollToHash', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('scrolls to the section named in the address on first render', () => {
    const portfolio = addSection('portfolio');
    const about = addSection('about');
    window.location.hash = '#portfolio';

    renderHook(() => {
      useScrollToHash();
    });

    expect(portfolio.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(about.scrollIntoView).not.toHaveBeenCalled();
  });

  it('jumps instantly instead of animating a scroll on page load', () => {
    const about = addSection('about');
    window.location.hash = '#about';

    renderHook(() => {
      useScrollToHash();
    });

    expect(about.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant' });
  });

  it('does nothing when the address has no hash', () => {
    const about = addSection('about');

    renderHook(() => {
      useScrollToHash();
    });

    expect(about.scrollIntoView).not.toHaveBeenCalled();
  });

  it('ignores a hash that matches no element', () => {
    const about = addSection('about');
    window.location.hash = '#does-not-exist';

    expect(() => {
      renderHook(() => {
        useScrollToHash();
      });
    }).not.toThrow();
    expect(about.scrollIntoView).not.toHaveBeenCalled();
  });

  it('survives a malformed percent-encoded hash', () => {
    addSection('about');
    window.location.hash = '#%E0%A4%A';

    expect(() => {
      renderHook(() => {
        useScrollToHash();
      });
    }).not.toThrow();
  });

  it('decodes an encoded id', () => {
    const section = addSection('my section');
    window.location.hash = '#my%20section';

    renderHook(() => {
      useScrollToHash();
    });

    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('only scrolls on the first render, not on every re-render', () => {
    const about = addSection('about');
    window.location.hash = '#about';

    const { rerender } = renderHook(() => {
      useScrollToHash();
    });
    rerender();
    rerender();

    expect(about.scrollIntoView).toHaveBeenCalledTimes(1);
  });
});
