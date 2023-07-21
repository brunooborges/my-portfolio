import { useEffect, useRef, useState } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  toggleMenu: () => void;
}

export default function useMobileMenu(): MobileMenuProps {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  function toggleMenu(): void {
    setIsOpen(!isOpen);
  }

  function handleClickOutside(event: MouseEvent): void {
    if (menuRef.current != null && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }

  function handleResize(): void {
    if (isOpen && window.innerWidth > 625) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isOpen,
    menuRef,
    toggleMenu,
  };
}
