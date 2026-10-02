import { ThemeProvider } from 'styled-components';

import Home from '../../pages/Home';
import Footer from '../Footer';
import Header from '../Header';

import defaultTheme from '../../assets/styles/Themes/default';
import GlobalStyles from '../../assets/styles/global';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import useScrollToHash from '../../hooks/useScrollToHash';
import { Container } from './styles';

export default function App(): React.JSX.Element {
  useDocumentMeta();
  useScrollToHash();

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />

      <Container>
        <Header />
        <Home />
        <Footer />
      </Container>
    </ThemeProvider>
  );
}
