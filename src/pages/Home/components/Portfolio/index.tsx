import React, { useState } from 'react';

import next from '../../../../assets/images/icons/slider-next.svg';
import prev from '../../../../assets/images/icons/slider-prev.svg';

import { projects } from '../../../../data/projects';

import Projects from '../../../../components/Project';

import { Container } from './styles';

interface PortfolioProps {
  id: string;
}

export default function Portfolio(props: PortfolioProps): JSX.Element {
  const [activeSlide, setActiveSlide] = useState<number>(1);

  function handlePrevSlide(): void {
    setActiveSlide((prevSlide) => (prevSlide > 1 ? prevSlide - 1 : projects.length));
  }

  function handleNextSlide(): void {
    setActiveSlide((prevSlide) => (prevSlide < projects.length ? prevSlide + 1 : 1));
  }

  return (
    <Container className='portfolio'>
      <div className='slider'>
        <div className='slider-carousel'>
          <div className='slider-counter'>
            <span className='slide-number'>
              {activeSlide < 10 ? `0${activeSlide}` : activeSlide}
            </span>
          </div>
          <nav className='slider-navigator'>
            {projects.map((slide) => (
              <div
                key={slide.id}
                className={slide.id === activeSlide ? 'active-slide' : ''}
                data-nav={slide.id}
              />
            ))}
          </nav>
        </div>
        <div className='slider-next-prev'>
          <div
            className='prev-slide'
            onClick={handlePrevSlide}
          >
            <img
              src={prev}
              alt=''
            />
          </div>

          <div className='slides-counter'>
            <span className='current-slide'>
              {activeSlide < 10 ? `0${activeSlide}` : activeSlide}
            </span>
            /
            <span className='total-slide'>
              {projects.length < 10 ? `0${projects.length}` : projects.length}
            </span>
          </div>

          <div
            className='next-slide'
            onClick={handleNextSlide}
          >
            <img
              src={next}
              alt=''
            />
          </div>
        </div>
      </div>

      <div className='projects'>
        {projects.map((project) => (
          <Projects
            isActive={project.id === activeSlide}
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </Container>
  );
}
