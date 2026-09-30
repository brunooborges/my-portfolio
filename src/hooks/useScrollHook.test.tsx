import { act, renderHook } from '@testing-library/react';

import useScrollHook from './useScrollHook';

function scrollTo(y: number): void {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('useScrollHook', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('is false until the page is scrolled past the threshold', () => {
    const { result } = renderHook(() => useScrollHook({ heightScrolled: 100 }));

    expect(result.current).toBe(false);
    scrollTo(100);
    expect(result.current).toBe(false);
    scrollTo(101);
    expect(result.current).toBe(true);
  });

  it('goes back to false when scrolling up again', () => {
    const { result } = renderHook(() => useScrollHook({ heightScrolled: 50 }));

    scrollTo(300);
    expect(result.current).toBe(true);
    scrollTo(10);
    expect(result.current).toBe(false);
  });

  it('only re-renders when the boolean changes, not on every scroll event', () => {
    let renders = 0;
    renderHook(() => {
      renders += 1;
      return useScrollHook({ heightScrolled: 100 });
    });
    const initial = renders;

    scrollTo(10);
    scrollTo(20);
    scrollTo(30);

    expect(renders).toBe(initial);
  });

  it('stops listening when unmounted', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollHook({ heightScrolled: 100 }));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});
