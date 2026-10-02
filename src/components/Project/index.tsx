import { useCallback, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import useTranslatedList from '../../hooks/useTranslatedList';
import wrapIndex from '../../lib/wrapIndex';
import { type Project } from '../../types/Project';
import ChevronIcon from '../ChevronIcon';
import Modal from '../Modal';
import { Container } from './styles';

interface ProjectCardProps {
  project: Project;
}

const EXTERNAL_REL = 'noopener noreferrer';

export default function ProjectCard({ project }: ProjectCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const { slug, name, visibility, tech, screenshots = [], screenshotOrientation = 'landscape', github, github2, live } =
    project;

  const summary = t(`projects.${slug}.summary`);
  const highlightList = useTranslatedList(`projects.${slug}.highlights`);
  const captions = useTranslatedList(`projects.${slug}.screenshots`);
  const [activeImage, setActiveImage] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const enlargeLabel = t('portfolio.openImage', { name });
  const captionOf = (index: number): string => captions[index] ?? t('portfolio.screenshotAlt', { name });
  const hasGallery = screenshots.length > 1;
  const currentImage = screenshots[activeImage];
  const hasTwoRepos = github2 !== undefined;

  const closeEnlarged = useCallback((): void => {
    setIsEnlarged(false);
  }, []);

  function showImage(step: number): void {
    setActiveImage((index) => wrapIndex(index, step, screenshots.length));
  }

  // Left and right browse the screenshots from anywhere in the gallery. The project slider has its
  // own arrow keys, but they live on the slider, not on the card, so the two never overlap.
  function handleGalleryKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!hasGallery || event.target instanceof HTMLAnchorElement) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  return (
    <Container data-orientation={screenshotOrientation}>
      <div className='left-section'>
        <h3 translate='no'>{name}</h3>
        {visibility === 'private' && (
          <p className='badge'>
            <span>{t('portfolio.companyProject')}</span>
            <small>{t('portfolio.companyProjectNote')}</small>
          </p>
        )}
        <p className='summary'>{summary}</p>

        {highlightList.length > 0 && (
          <ul
            className='highlights'
            aria-label={t('portfolio.highlights')}
          >
            {highlightList.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}

        <ul
          className='tech-list'
          aria-label={t('portfolio.technologies')}
          translate='no'
        >
          {tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {github !== undefined && (
          <div className='links'>
            {github !== undefined && (
              <a
                className='link-button'
                target='_blank'
                rel={EXTERNAL_REL}
                href={github}
              >
                {hasTwoRepos ? t('portfolio.sourceCodeFrontend') : t('portfolio.sourceCode')}
              </a>
            )}
            {github2 !== undefined && (
              <a
                className='link-button'
                target='_blank'
                rel={EXTERNAL_REL}
                href={github2}
              >
                {t('portfolio.sourceCodeBackend')}
              </a>
            )}
          </div>
        )}
      </div>

      <div
        className='right-section'
        onKeyDown={handleGalleryKeyDown}
      >
        {currentImage !== undefined ? (
          <>
            <div className='bg-effect'>
              <button
                type='button'
                className='screenshot-button'
                aria-label={enlargeLabel}
                onClick={() => {
                  setIsEnlarged(true);
                }}
              >
                <img
                  src={currentImage}
                  alt=''
                  loading='lazy'
                  decoding='async'
                />
              </button>
              {hasGallery && (
                <>
                  <button
                    type='button'
                    className='nav-button previous'
                    aria-label={t('portfolio.previousScreenshot')}
                    onClick={() => {
                      showImage(-1);
                    }}
                  >
                    <ChevronIcon direction='left' />
                  </button>
                  <button
                    type='button'
                    className='nav-button next'
                    aria-label={t('portfolio.nextScreenshot')}
                    onClick={() => {
                      showImage(1);
                    }}
                  >
                    <ChevronIcon direction='right' />
                  </button>
                </>
              )}
            </div>

            {hasGallery && (
              <>
                <p
                  className='caption'
                  aria-live='polite'
                >
                  {captionOf(activeImage)}
                </p>
                <ul
                  className='thumbs'
                  aria-label={t('portfolio.screenshotsLabel')}
                >
                  {screenshots.map((image, index) => (
                    <li key={image}>
                      <button
                        type='button'
                        aria-label={captionOf(index)}
                        aria-pressed={index === activeImage}
                        onClick={() => {
                          setActiveImage(index);
                        }}
                      >
                        <img
                          src={image}
                          alt=''
                          loading='lazy'
                          decoding='async'
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <div
            className='bg-effect placeholder'
            role='img'
            aria-label={t('portfolio.placeholderMedia')}
          >
            <span
              className='monogram'
              aria-hidden='true'
              translate='no'
            >
              {name.charAt(0)}
            </span>
            <span
              className='placeholder-text'
              aria-hidden='true'
            >
              {t('portfolio.placeholderMedia')}
            </span>
          </div>
        )}

        {live !== undefined && (
          <a
            className='link-button'
            target='_blank'
            rel={EXTERNAL_REL}
            href={live}
          >
            {t('portfolio.visitWebsite')}
          </a>
        )}
      </div>

      {isEnlarged &&
        currentImage !== undefined &&
        createPortal(
          <Modal
            images={screenshots.map((src, index) => ({ src, alt: captionOf(index) }))}
            index={activeImage}
            onIndexChange={setActiveImage}
            orientation={screenshotOrientation}
            closeModal={closeEnlarged}
          />,
          document.body,
        )}
    </Container>
  );
}
