import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

import photo from '../../../../assets/images/bruno-photo.webp';

import useTranslatedList from '../../../../hooks/useTranslatedList';
import { techStack } from './techStack';
import { Container } from './styles';

interface AboutProps {
  id: string;
}

export default function About({ id }: AboutProps): React.JSX.Element {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const paragraphs = useTranslatedList('about.paragraphs');

  return (
    <Container
      id={id}
      ref={ref}
      data-isvisible={inView}
      className='about'
      aria-labelledby={`${id}-title`}
    >
      <div className='about-me'>
        <h2 id={`${id}-title`}>{t('about.title')}</h2>
        <div className='infos'>
          <div className='slide-from-left'>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className='slide-from-right'>
            <img
              src={photo}
              alt={t('about.photoAlt')}
              width={600}
              height={600}
              loading='lazy'
              decoding='async'
            />
          </div>
        </div>
      </div>

      <ul
        className='techs'
        aria-label={t('about.stackLabel')}
        translate='no'
      >
        {techStack.map(({ id: techId, label, path, color }, index) => (
          <li
            key={techId}
            className={`tech ${index % 2 === 0 ? 'bot' : 'top'}`}
          >
            <svg
              viewBox='0 0 24 24'
              aria-hidden='true'
              focusable='false'
              width='48'
              height='48'
            >
              <path
                d={path}
                fill={color}
              />
            </svg>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
