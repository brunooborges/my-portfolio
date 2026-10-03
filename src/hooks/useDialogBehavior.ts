import { useEffect, type RefObject } from 'react';

/**
 * What a modal dialog needs from the page: lock the page scroll, move focus in (to the first
 * stop), keep Tab inside the dialog by cycling through `stops`, close on Escape, and give focus
 * back to whatever opened it. Stops that are not rendered (a null ref) are skipped.
 */
export default function useDialogBehavior(onClose: () => void, stops: ReadonlyArray<RefObject<HTMLElement | null>>): void {
  // Once, when the dialog opens.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    stops[0]?.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
    // The first stop is read once, at open time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const elements = stops.map((stop) => stop.current).filter((element): element is HTMLElement => element !== null);
      const current = elements.findIndex((element) => element === document.activeElement);
      const last = elements.length - 1;
      const next = event.shiftKey
        ? current <= 0
          ? last
          : current - 1
        : current === -1 || current === last
          ? 0
          : current + 1;

      event.preventDefault();
      elements[next]?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, stops]);
}
