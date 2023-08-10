import React from 'react';

import { Container } from './styles';

interface Props {
  image: string;
  closeModal: () => void;
}

export default function Modal({ image, closeModal }: Props): JSX.Element {
  return (
    <Container>
      <div
        onClick={closeModal}
        className='image-background'
      >
        <img
          src={image}
          alt=''
        />
      </div>
      <div
        onClick={closeModal}
        className='closer'
      >
        x
      </div>
    </Container>
  );
}
