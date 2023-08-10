import React, { useState } from 'react';

import next from '../../../../assets/images/icons/slider-next.svg';
import prev from '../../../../assets/images/icons/slider-prev.svg';

import { projects } from '../../../../data/projects';

import Projects from '../../../../components/Project';

import Modal from '../../../../components/Modal';
import { Container } from './styles';

interface PortfolioProps {
  id: string;
}

export default function Portfolio(props: PortfolioProps): JSX.Element {
  const [activeSlide, setActiveSlide] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [imageOfModal, setImageOfModal] = useState('');

  function openModal(): void {
    setShowModal(true);
  }

  function closeModal(): void {
    setShowModal(false);
  }

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
            onClick={() => {
              openModal();
              setImageOfModal(project.screenshot);
            }}
          />
        ))}
      </div>

      {showModal && (
        <Modal
          image={imageOfModal}
          closeModal={closeModal}
        />
      )}
    </Container>
  );
}
