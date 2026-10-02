import { useEffect } from 'react';

function readHashId(): string | null {
  const raw = window.location.hash.slice(1);
  if (raw === '') {
    return null;
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

/**
 * Opening the site on a direct link such as `/#portfolio` does not scroll on its own:
 * the sections are rendered by React, so they do not exist yet when the browser looks
 * for the anchor. Once they are mounted, jump to the one named in the address.
 * Clicks on in-page links are handled natively by the browser, so this runs only once.
 */
export default function useScrollToHash(): void {
  useEffect(() => {
    const id = readHashId();
    if (id === null) {
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);
}
