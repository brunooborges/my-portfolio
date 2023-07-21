import React from 'react';

import arrow from '../../../../assets/images/icons/arrow-down.svg';
import github from '../../../../assets/images/icons/github.svg';
import linkedin from '../../../../assets/images/icons/linkedin.svg';

import useScrollHook from '../../../../hooks/useScrollHook';

import { Container } from './styles';

interface IntroProps {
  id: string;
}

export default function Intro(props: IntroProps): JSX.Element {
  const isScrolled = useScrollHook({ heightScrolled: 50 });

  return (
    <Container
      data-isscrolled={isScrolled}
      className='intro'
    >
      <div className='info'>
        <p>Hi, my name is</p>
        <h1>Bruno Borges</h1>
        <h2>Front-End Developer</h2>
        <div>
          <a
            href='https://www.linkedin.com/in/brunooborges/'
            target='_blank'
            rel='noreferrer'
          >
            <img
              src={linkedin}
              alt='linkedin'
            />
          </a>
          <a
            href='https://github.com/brunooborges/'
            target='_blank'
            rel='noreferrer'
          >
            <img
              src={github}
              alt='github'
            />
          </a>
        </div>
      </div>

      <div className='scroll'>
        <div className='arrow'>
          <img
            src={arrow}
            alt='scroll-down'
            srcSet=''
          />
        </div>
      </div>
      <div />
    </Container>
  );
}
