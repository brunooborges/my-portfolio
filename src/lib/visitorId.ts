const STORAGE_KEY = 'visitorId';
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Returns this browser's anonymous visitor id, creating and storing one on the
 * first visit. The id is a random UUID: it is not derived from, and carries no
 * information about, the person or device.
 *
 * Returns `null` when an id cannot be kept (storage blocked, no
 * `crypto.randomUUID`). Callers must then avoid counting the visit, because a
 * fresh id on every page load would count the same person again and again.
 */
export function getVisitorId(): string | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null && UUID_V4.test(stored)) {
      return stored;
    }

    if (typeof globalThis.crypto?.randomUUID !== 'function') {
      return null;
    }

    const id = globalThis.crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return null;
  }
}
