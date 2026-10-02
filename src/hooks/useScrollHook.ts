import { useCallback, useSyncExternalStore } from 'react';

interface UseScrollHookProps {
  heightScrolled: number;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => {
    window.removeEventListener('scroll', onChange);
  };
}

/**
 * True once the page is scrolled past `heightScrolled` px. Subscribing to a
 * boolean snapshot means components re-render only when it flips, not on every
 * scroll frame.
 */
export default function useScrollHook({ heightScrolled }: UseScrollHookProps): boolean {
  const getSnapshot = useCallback((): boolean => window.scrollY > heightScrolled, [heightScrolled]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
