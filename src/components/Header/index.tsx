import React from 'react';
import { Link } from 'react-scroll';

import MobileMenu from './components/MobileMenu';

import logo from '../../assets/images/logos/logo-b-front-end.svg';

import useScrollHook from '../../hooks/useScrollHook';

import { Container, Menu } from './styles';

export default function Header(): JSX.Element {
  const isScrolled = useScrollHook({ heightScrolled: 250 });

  return (
    <Container data-isscrolled={isScrolled}>
      <div className='logo'>
        <a
          href='/'
          className='logo-link'
        >
          <img
            src={logo}
            alt=''
            srcSet=''
          />
        </a>
      </div>

      <Menu>
        <Link
          to='intro'
          smooth={true}
          duration={500}
          offset={-50}
        >
          <span>home</span>
        </Link>
        <Link
          to='about'
          smooth={true}
          duration={500}
          offset={-90}
        >
          <span>about</span>
        </Link>
        <Link
          to='portfolio'
          smooth={true}
          duration={500}
          offset={-100}
        >
          <span>portfolio</span>
        </Link>
      </Menu>
      <MobileMenu />
    </Container>
  );
}
