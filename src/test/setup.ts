import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Node 25 ships an experimental global `localStorage` that shadows the DOM
 * implementation and is unusable without `--localstorage-file`. Tests get a
 * small in-memory Storage instead so behavior is identical on every Node version.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

Object.defineProperty(window, 'localStorage', { value: new MemoryStorage(), configurable: true });
Object.defineProperty(globalThis, 'localStorage', {
  value: window.localStorage,
  configurable: true,
});

/**
 * happy-dom reports `prefers-color-scheme: light` as matching, which would start every test in the
 * light theme. Tests get a system that asks for nothing (so the site's dark design applies);
 * a test that needs another preference mocks `window.matchMedia` itself.
 */
window.matchMedia = ((query: string): MediaQueryList =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }) as MediaQueryList) as typeof window.matchMedia;

if (typeof globalThis.IntersectionObserver === 'undefined') {
  class NoopIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: readonly number[] = [];
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver = NoopIntersectionObserver;
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
