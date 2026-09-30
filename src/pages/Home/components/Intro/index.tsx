import { useTranslation } from 'react-i18next';

import arrow from '../../../../assets/images/icons/arrow-down.svg';
import github from '../../../../assets/images/icons/github.svg';
import linkedin from '../../../../assets/images/icons/linkedin.svg';

import useScrollHook from '../../../../hooks/useScrollHook';

import { Container } from './styles';

interface IntroProps {
  id: string;
}

export default function Intro({ id }: IntroProps): React.JSX.Element {
  const { t } = useTranslation();
  const isScrolled = useScrollHook({ heightScrolled: 50 });

  return (
    <Container
      id={id}
      data-isscrolled={isScrolled}
      className='intro'
    >
      <div className='info'>
        <p>{t('intro.greeting')}</p>
        <h1 translate='no'>Bruno Borges</h1>
        <h2>{t('intro.role')}</h2>
        <div>
          <a
            href='https://www.linkedin.com/in/brunooborges/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src={linkedin}
              alt={t('intro.linkedin')}
            />
          </a>
          <a
            href='https://github.com/brunooborges/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src={github}
              alt={t('intro.github')}
            />
          </a>
        </div>
      </div>

      <div
        className='scroll'
        aria-hidden='true'
      >
        <div className='arrow'>
          <img
            src={arrow}
            alt=''
          />
        </div>
      </div>
    </Container>
  );
}
