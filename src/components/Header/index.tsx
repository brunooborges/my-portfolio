import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../LanguageSwitcher';
import MobileMenu from './components/MobileMenu';

import logo from '../../assets/images/logos/logo-b-front-end.svg';

import useScrollHook from '../../hooks/useScrollHook';

import { Container, Menu } from './styles';

export default function Header(): React.JSX.Element {
  const { t } = useTranslation();
  const isScrolled = useScrollHook({ heightScrolled: 250 });

  return (
    <Container data-isscrolled={isScrolled}>
      <div className='logo'>
        <a
          href='/'
          className='logo-link'
          aria-label={t('nav.home')}
        >
          <img
            src={logo}
            alt=''
          />
        </a>
      </div>

      <Menu aria-label={t('nav.main')}>
        <a href='#intro'>
          <span>{t('nav.home')}</span>
        </a>
        <a href='#about'>
          <span>{t('nav.about')}</span>
        </a>
        <a href='#portfolio'>
          <span>{t('nav.portfolio')}</span>
        </a>
        <a href='#contact'>
          <span>{t('nav.contact')}</span>
        </a>
      </Menu>

      <div className='header-language'>
        <LanguageSwitcher />
      </div>

      <MobileMenu />
    </Container>
  );
}
