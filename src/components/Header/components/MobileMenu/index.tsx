import React from 'react';
import { Link } from 'react-scroll';

import close from '../../../../assets/images/icons/close-menu.svg';
import menu from '../../../../assets/images/icons/menu-icon.svg';

import useMobileMenu from './useMobileMenu';

import { MenuMobile, Overlay, SideBar } from './styles';

export default function MobileMenu(): JSX.Element {
  const { isOpen, menuRef, toggleMenu } = useMobileMenu();

  return (
    <>
      {isOpen && <Overlay data-isopen={isOpen} />}
      <MenuMobile ref={menuRef}>
        <button
          type='button'
          onClick={toggleMenu}
        >
          <img
            src={isOpen ? close : menu}
            alt='mobile-menu'
          />
        </button>
        <nav>
          <SideBar
            data-isopen={isOpen}
            className='mobile-menu'
          >
            <Link
              to='intro'
              smooth={false}
              duration={500}
              offset={-50}
              onClick={toggleMenu}
            >
              <span>Home</span>
            </Link>
            <Link
              to='about'
              smooth={false}
              duration={500}
              offset={-90}
              onClick={toggleMenu}
            >
              <span>About</span>
            </Link>
            <Link
              to='portfolio'
              smooth={false}
              duration={500}
              offset={-100}
              onClick={toggleMenu}
            >
              <span>Portfolio</span>
            </Link>
          </SideBar>
        </nav>
      </MenuMobile>
    </>
  );
}
