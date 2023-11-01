import React from 'react';

import { Container } from './styles';

import useFooter from './useFooter';

export default function Footer(): JSX.Element {
  const { count } = useFooter();

  return (
    <Container>
      <p translate='no'>Designed & Built by Bruno Borges © 2023 - Visitors Count: {count}</p>
    </Container>
  );
}
