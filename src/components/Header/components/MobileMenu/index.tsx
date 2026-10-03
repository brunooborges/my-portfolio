import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import close from '../../../../assets/images/icons/close-menu.svg';
import menu from '../../../../assets/images/icons/menu-icon.svg';

import ThemeToggle from '../../../ThemeToggle';
import useMobileMenu from './useMobileMenu';

import { MenuMobile, Overlay, SideBar } from './styles';

export default function MobileMenu(): React.JSX.Element {
  const { t } = useTranslation();
  const { isOpen, menuRef, toggleRef, toggleMenu } = useMobileMenu();
  const sidebarId = useId();

  return (
    <>
      {isOpen && <Overlay data-isopen={isOpen} />}
      <MenuMobile ref={menuRef}>
        <button
          ref={toggleRef}
          type='button'
          onClick={toggleMenu}
          aria-label={t('nav.menu')}
          aria-expanded={isOpen}
          aria-controls={sidebarId}
        >
          <img
            src={isOpen ? close : menu}
            alt=''
          />
        </button>
        <nav aria-label={t('nav.mobile')}>
          <SideBar
            id={sidebarId}
            data-isopen={isOpen}
            inert={!isOpen}
            className='mobile-menu'
          >
            <a
              href='#intro'
              onClick={toggleMenu}
            >
              <span>{t('nav.home')}</span>
            </a>
            <a
              href='#about'
              onClick={toggleMenu}
            >
              <span>{t('nav.about')}</span>
            </a>
            <a
              href='#portfolio'
              onClick={toggleMenu}
            >
              <span>{t('nav.portfolio')}</span>
            </a>
            <a
              href='#contact'
              onClick={toggleMenu}
            >
              <span>{t('nav.contact')}</span>
            </a>
            <div className='menu-theme'>
              <ThemeToggle withLabel />
            </div>
          </SideBar>
        </nav>
      </MenuMobile>
    </>
  );
}
