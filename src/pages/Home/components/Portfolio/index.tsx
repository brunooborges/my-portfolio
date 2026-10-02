import { useCallback, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import next from '../../../../assets/images/icons/slider-next.svg';
import prev from '../../../../assets/images/icons/slider-prev.svg';

import Modal from '../../../../components/Modal';
import ProjectCard from '../../../../components/Project';
import { experimentProjects, featuredProjects } from '../../../../data/projects';
import { type ScreenshotOrientation } from '../../../../types/Project';

import { Experiments, Section, Showcase } from './styles';

interface PortfolioProps {
  id: string;
}

interface ModalImage {
  src: string;
  alt: string;
  orientation: ScreenshotOrientation;
}

const EXTERNAL_REL = 'noopener noreferrer';

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export default function Portfolio({ id }: PortfolioProps): React.JSX.Element {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalImage, setModalImage] = useState<ModalImage | null>(null);

  const total = featuredProjects.length;
  const activeProject = featuredProjects[activeIndex];
  const position = activeIndex + 1;

  const handlePrevSlide = useCallback((): void => {
    setActiveIndex((index) => (index > 0 ? index - 1 : total - 1));
  }, [total]);

  const handleNextSlide = useCallback((): void => {
    setActiveIndex((index) => (index < total - 1 ? index + 1 : 0));
  }, [total]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'ArrowRight') {
      handleNextSlide();
    } else if (event.key === 'ArrowLeft') {
      handlePrevSlide();
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(total - 1);
    }
  }

  const closeModal = useCallback((): void => {
    setModalImage(null);
  }, []);

  return (
    <Section
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <h2
        id={`${id}-title`}
        className='sr-only'
      >
        {t('portfolio.title')}
      </h2>

      <Showcase>
        <div
          className='slider'
          onKeyDown={handleKeyDown}
        >
          <div
            className='slider-carousel'
            aria-hidden='true'
          >
            <div className='slider-counter'>
              <span className='slide-number'>{pad(position)}</span>
            </div>
            <div className='slider-navigator'>
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={index === activeIndex ? 'active-slide' : ''}
                />
              ))}
            </div>
          </div>

          <div className='slider-next-prev'>
            <button
              type='button'
              className='prev-slide'
              aria-label={t('portfolio.previous')}
              onClick={handlePrevSlide}
            >
              <img
                src={prev}
                alt=''
              />
            </button>

            <div
              className='slides-counter'
              aria-hidden='true'
            >
              <span className='current-slide'>{pad(position)}</span>/<span className='total-slide'>{pad(total)}</span>
            </div>
            <p
              role='status'
              className='sr-only'
            >
              {t('portfolio.counter', { current: position, total })}
            </p>

            <button
              type='button'
              className='next-slide'
              aria-label={t('portfolio.next')}
              onClick={handleNextSlide}
            >
              <img
                src={next}
                alt=''
              />
            </button>
          </div>
        </div>

        <div className='projects'>
          <ProjectCard
            key={activeProject.id}
            project={activeProject}
            onOpenImage={(src, alt) => {
              setModalImage({ src, alt, orientation: activeProject.screenshotOrientation ?? 'landscape' });
            }}
          />
        </div>
      </Showcase>

      <Experiments aria-labelledby={`${id}-experiments`}>
        <h3 id={`${id}-experiments`}>{t('portfolio.experimentsTitle')}</h3>
        <ul>
          {experimentProjects.map((project) => (
            <li key={project.id}>
              <span
                className='name'
                translate='no'
              >
                {project.name}
              </span>
              <span className='links'>
                {project.live !== undefined && (
                  <a
                    href={project.live}
                    target='_blank'
                    rel={EXTERNAL_REL}
                    aria-label={`${project.name}: ${t('portfolio.live')}`}
                  >
                    {t('portfolio.live')}
                  </a>
                )}
                {project.github !== undefined && (
                  <a
                    href={project.github}
                    target='_blank'
                    rel={EXTERNAL_REL}
                    aria-label={`${project.name}: ${t('portfolio.source')}`}
                  >
                    {t('portfolio.source')}
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Experiments>

      {modalImage !== null && (
        <Modal
          image={modalImage.src}
          alt={modalImage.alt}
          orientation={modalImage.orientation}
          closeModal={closeModal}
        />
      )}
    </Section>
  );
}
