import { useEffect, useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import wrapIndex from '../../lib/wrapIndex';
import { type ScreenshotOrientation } from '../../types/Project';
import ChevronIcon from '../ChevronIcon';
import { Container } from './styles';

export interface ModalImage {
  src: string;
  alt: string;
}

interface ModalProps {
  /** Every image of the set; the dialog shows `images[index]` and lets the visitor browse the rest. */
  images: readonly ModalImage[];
  index: number;
  onIndexChange: (index: number) => void;
  /** `portrait` fits a tall phone screenshot to the screen height instead of scrolling it. */
  orientation?: ScreenshotOrientation;
  closeModal: () => void;
}

export default function Modal({
  images,
  index,
  onIndexChange,
  orientation = 'landscape',
  closeModal,
}: ModalProps): React.JSX.Element {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const imageAreaRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const hasSeveral = total > 1;
  const current = images[index] ?? images[0];

  // Set up once when the dialog opens: lock page scroll, take focus, and give it back on close.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      if (hasSeveral && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        onIndexChange(wrapIndex(index, event.key === 'ArrowLeft' ? -1 : 1, total));
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      // A handful of stops (close, previous, next, the scrollable image area): cycle through them
      // so focus never leaves the dialog and keyboard users can scroll a tall image.
      const candidates: Array<HTMLElement | null> = [
        closeButtonRef.current,
        previousButtonRef.current,
        nextButtonRef.current,
        imageAreaRef.current,
      ];
      const stops = candidates.filter((element): element is HTMLElement => element !== null);
      const currentStop = stops.findIndex((element) => element === document.activeElement);
      const last = stops.length - 1;
      const next = event.shiftKey
        ? currentStop <= 0
          ? last
          : currentStop - 1
        : currentStop === -1 || currentStop === last
          ? 0
          : currentStop + 1;

      event.preventDefault();
      stops[next]?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal, hasSeveral, index, onIndexChange, total]);

  // A tall screenshot starts from its top, not wherever the previous one was scrolled to.
  useEffect(() => {
    if (imageAreaRef.current !== null) {
      imageAreaRef.current.scrollTop = 0;
    }
  }, [index]);

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
      data-orientation={orientation}
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
          src={current.src}
          alt={current.alt}
        />
      </div>
      {hasSeveral && (
        <>
          <button
            ref={previousButtonRef}
            type='button'
            className='nav-button previous'
            aria-label={t('portfolio.previousScreenshot')}
            onClick={() => {
              onIndexChange(wrapIndex(index, -1, total));
            }}
          >
            <ChevronIcon direction='left' />
          </button>
          <button
            ref={nextButtonRef}
            type='button'
            className='nav-button next'
            aria-label={t('portfolio.nextScreenshot')}
            onClick={() => {
              onIndexChange(wrapIndex(index, 1, total));
            }}
          >
            <ChevronIcon direction='right' />
          </button>
          <p
            className='counter'
            aria-live='polite'
          >
            {t('modal.counter', { current: index + 1, total })}
          </p>
        </>
      )}
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
