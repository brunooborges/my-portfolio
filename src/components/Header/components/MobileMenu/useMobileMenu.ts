import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** Must match the max-width of the mobile menu media queries in styles.tsx. */
const MOBILE_MENU_MAX_WIDTH = 635;

interface MobileMenuState {
  isOpen: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  toggleRef: RefObject<HTMLButtonElement | null>;
  toggleMenu: () => void;
}

export default function useMobileMenu(): MobileMenuState {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = useCallback((): void => {
    setIsOpen((open) => !open);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (menuRef.current != null && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleResize(): void {
      if (window.innerWidth > MOBILE_MENU_MAX_WIDTH) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return { isOpen, menuRef, toggleRef, toggleMenu };
}
