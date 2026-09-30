import { useEffect, useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from './styles';

interface ModalProps {
  image: string;
  alt: string;
  closeModal: () => void;
}

export default function Modal({ image, alt, closeModal }: ModalProps): React.JSX.Element {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      // Two stops only (close button, scrollable image area): cycle between them so
      // focus never leaves the dialog and keyboard users can scroll a tall image.
      const candidates: Array<HTMLElement | null> = [closeButtonRef.current, imageAreaRef.current];
      const stops = candidates.filter((element): element is HTMLElement => element !== null);
      const current = stops.findIndex((element) => element === document.activeElement);
      const last = stops.length - 1;
      const next = event.shiftKey
        ? current <= 0
          ? last
          : current - 1
        : current === -1 || current === last
          ? 0
          : current + 1;

      event.preventDefault();
      stops[next]?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [closeModal]);

  // Only a click on the dark area itself closes the dialog: a click on the image must not,
  // so the image can be scrolled and dragged.
  function handleBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  return (
    <Container
      role='dialog'
      aria-modal='true'
      aria-label={t('modal.title')}
    >
      <div
        ref={imageAreaRef}
        role='region'
        tabIndex={0}
        aria-label={t('modal.imageArea')}
        onClick={handleBackdropClick}
        className='image-background'
      >
        <img
          src={image}
          alt={alt}
        />
      </div>
      <button
        ref={closeButtonRef}
        type='button'
        onClick={closeModal}
        className='closer'
        aria-label={t('modal.close')}
      >
        <span aria-hidden='true'>&times;</span>
      </button>
    </Container>
  );
}
