import React from 'react';
import { ThemeProvider } from 'styled-components';

import Home from '../../pages/Home';
import Footer from '../Footer';
import Header from '../Header';

import defaultTheme from '../../assets/styles/Themes/default';
import GlobalStyles from '../../assets/styles/global';
import { Container } from './styles';

export default function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles />

        <Container>
          <Header />
          <Home />
          <Footer />
        </Container>
      </ThemeProvider>
    </>
  );
}
