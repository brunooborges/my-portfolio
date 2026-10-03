import { useId, useMemo, useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import useDialogBehavior from '../../hooks/useDialogBehavior';
import useTranslatedList from '../../hooks/useTranslatedList';
import { type CaseStudySlug } from '../../types/Project';
import { Overlay } from './styles';

interface CaseStudyProps {
  slug: CaseStudySlug;
  name: string;
  onClose: () => void;
}

/** The story behind a project: the problem, my role, how it works step by step, and the result. */
export default function CaseStudy({ slug, name, onClose }: CaseStudyProps): React.JSX.Element {
  const { t } = useTranslation();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const stops = useMemo(() => [closeRef, bodyRef], []);
  const titles = useTranslatedList(`caseStudies.${slug}.flowTitles`);
  const details = useTranslatedList(`caseStudies.${slug}.flowDetails`);

  useDialogBehavior(onClose, stops);

  // Only a click on the dark area itself closes the dialog, so the text can be selected.
  function handleBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <Overlay
      role='dialog'
      aria-modal='true'
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <div className='panel'>
        <header>
          <h2 id={titleId}>
            <span translate='no'>{name}</span>
            <small>{t('caseStudy.open')}</small>
          </h2>
          <button
            ref={closeRef}
            type='button'
            className='close'
            aria-label={t('caseStudy.close')}
            onClick={onClose}
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        </header>

        <div
          ref={bodyRef}
          className='body'
          role='region'
          tabIndex={0}
          aria-labelledby={titleId}
        >
          <section>
            <h3>{t('caseStudy.problem')}</h3>
            <p>{t(`caseStudies.${slug}.problem`)}</p>
          </section>

          <section>
            <h3>{t('caseStudy.role')}</h3>
            <p>{t(`caseStudies.${slug}.role`)}</p>
          </section>

          <section>
            <h3>{t('caseStudy.flow')}</h3>
            <ol
              className='flow'
              aria-label={t('caseStudy.flowLabel')}
            >
              {titles.map((title, index) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <p>{details[index]}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3>{t('caseStudy.outcome')}</h3>
            <p className='outcome'>{t(`caseStudies.${slug}.outcome`)}</p>
          </section>
        </div>
      </div>
    </Overlay>
  );
}
