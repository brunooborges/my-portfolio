import { useTranslation } from 'react-i18next';

import useTranslatedList from '../../hooks/useTranslatedList';
import { type Project } from '../../types/Project';
import { Container } from './styles';

interface ProjectCardProps {
  project: Project;
  onOpenImage: (image: string, alt: string) => void;
}

const EXTERNAL_REL = 'noopener noreferrer';

export default function ProjectCard({ project, onOpenImage }: ProjectCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const { slug, name, visibility, tech, screenshot, github, github2, live } = project;

  const summary = t(`projects.${slug}.summary`);
  const highlightList = useTranslatedList(`projects.${slug}.highlights`);
  const enlargeLabel = t('portfolio.openImage', { name });
  const hasTwoRepos = github2 !== undefined;

  return (
    <Container>
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

      <div className='right-section'>
        {screenshot !== undefined ? (
          <div className='bg-effect'>
            <button
              type='button'
              className='screenshot-button'
              aria-label={enlargeLabel}
              onClick={() => {
                onOpenImage(screenshot, t('portfolio.screenshotAlt', { name }));
              }}
            >
              <img
                src={screenshot}
                alt=''
              />
            </button>
          </div>
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
    </Container>
  );
}
