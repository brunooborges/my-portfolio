import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        closeModal();
      } else if (event.key === 'Tab') {
        // The close button is the only interactive control: keep focus inside the dialog.
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [closeModal]);

  return (
    <Container
      role='dialog'
      aria-modal='true'
      aria-label={t('modal.title')}
    >
      <div
        onClick={closeModal}
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
