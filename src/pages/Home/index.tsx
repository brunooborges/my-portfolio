import React from 'react';

import About from './components/About';
import Intro from './components/Intro';
import Portfolio from './components/Portfolio';

import { Container } from './styles';

export default function Home(): JSX.Element {
  return (
    <Container>
      <Intro id='intro' />
      <About id='about' />
      <Portfolio id='portfolio' />
    </Container>
  );
}
