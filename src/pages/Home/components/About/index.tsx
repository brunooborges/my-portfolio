import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import photo from '../../../../assets/images/bruno-photo.png';
import css from '../../../../assets/images/logos/css_logo.png';
import html from '../../../../assets/images/logos/html_logo.png';
import js from '../../../../assets/images/logos/js_logo.png';
import next from '../../../../assets/images/logos/nextjs_logo.png';
import node from '../../../../assets/images/logos/node_logo.png';
import php from '../../../../assets/images/logos/php_logo.png';
import react from '../../../../assets/images/logos/react_logo.png';
import tailwind from '../../../../assets/images/logos/tailwind_logo.png';
import ts from '../../../../assets/images/logos/ts_logo.png';

import { Container } from './styles';

interface AboutProps {
  id: string;
}

export default function About(props: AboutProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [inView]);

  return (
    <Container
      ref={ref}
      data-isvisible={isVisible}
      className='about'
    >
      <div className='about-me'>
        <h2>About</h2>
        <div className='infos'>
          <div className='slide-from-left'>
            <p>
              Hi, my name is Bruno, and I am a Front-end Developer. I always wanted to study and
              work with technology and development, but I never had the chance. Now, I{"'"}ve given
              myself the opportunity to truly pursue this dream. As a result, I began studying
              programming. Since then, my objective has been to achieve a career transition and work
              as a Developer.
              <br />
              <br />
              Although I hold a Bachelor{"'"}s Degree in Civil Engineering, I never felt a sense of
              belonging in that field because my desire for knowledge and interest in technology far
              surpassed everything related to civil engineering. I have always been the go-to{' '}
              {"'IT'"} guy for my family and friends, and better late than never, I realized that
              this is the path I should follow.
              <br />
              <br />
              It has been quite challenging taking this new step in my life because there are
              numerous technologies, programming languages, frameworks, etc., which can sometimes be
              overwhelming. However, I am successfully navigating through it all with my
              intelligence. The English I learned at the age of 15 and have continued to use up
              until today is truly facilitating my learning. It is not an easy journey, but I am
              thoroughly enjoying it.
              <br />
              <br />
              Currently, I have been studying to work as a Front-end Developer with a focus on
              React.js using Next.js, Tailwind, and Typescript. However, I also have knowledge in
              back-end development, particularly in Node.js and PHP, so I intend to work as a
              Fullstack Developer in the future.
              <br />
              <br />
              As a technology and innovation enthusiast, I am eagerly looking forward to being part
              of a team that shares the same passion!
            </p>
          </div>
          <div className='slide-from-right'>
            <img
              src={photo}
              alt='profile'
              srcSet=''
            />
          </div>
        </div>
      </div>
      <div className='techs'>
        <div className='tech bot'>
          <span>HTML 5</span>
          <img
            src={html}
            alt='html5'
          />
        </div>

        <div className='tech top'>
          <span>CSS 3</span>
          <img
            src={css}
            alt='css3'
          />
        </div>

        <div className='tech bot'>
          <span>JS ES6+</span>
          <img
            src={js}
            alt='javascript'
          />
        </div>

        <div className='tech top'>
          <span>PHP</span>
          <img
            src={php}
            alt='php'
          />
        </div>

        <div className='tech bot'>
          <span>EXPRESS</span>
          <img
            src={node}
            alt='nodejs'
          />
        </div>

        <div className='tech top'>
          <span>REACT</span>
          <img
            src={react}
            alt='reactjs'
          />
        </div>

        <div className='tech bot'>
          <span>NEXTJS</span>
          <img
            src={next}
            alt='nextjs'
          />
        </div>

        <div className='tech top'>
          <span>TYPESCRIPT</span>
          <img
            src={ts}
            alt='typescript'
          />
        </div>

        <div className='tech bot tailwind'>
          <span>TAILWIND</span>
          <img
            src={tailwind}
            alt='tailwind'
          />
        </div>
      </div>
    </Container>
  );
}
