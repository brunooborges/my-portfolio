import React from 'react';
import { Container } from './styles';

import { type Project } from '../../types/Project';

interface Props {
  project: Project;
  isActive: boolean;
  onClick: any;
}

export default function Projects({ project, isActive, onClick }: Props): JSX.Element {
  return (
    <Container data-isactive={isActive}>
      <div className='left-section'>
        <h1 translate='no'>{project.name}</h1>
        <p>{project.description}</p>
        <button
          className='link-button'
          type='button'
        >
          <a
            target='_blank'
            href={project.github}
            rel='noreferrer'
          >
            Source Code
          </a>
        </button>
        {project.github2 && (
          <button
            className='link-button'
            type='button'
          >
            <a
              target='_blank'
              href={project.github2}
              rel='noreferrer'
            >
              Source Code
            </a>
          </button>
        )}
      </div>
      <div className='right-section'>
        <div className='bg-effect'>
          <img
            src={project.screenshot}
            alt='screenshot'
            onClick={onClick}
          />
        </div>
        <button
          className='link-button'
          type='button'
        >
          <a
            target='_blank'
            href={project.live}
            rel='noreferrer'
          >
            Visit website
          </a>
        </button>
      </div>
    </Container>
  );
}
