import Home from '../../pages/Home';
import Footer from '../Footer';
import Header from '../Header';

import GlobalStyles from '../../assets/styles/global';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import useScrollToHash from '../../hooks/useScrollToHash';
import ThemeModeProvider from '../../theme/ThemeModeProvider';
import { Container } from './styles';

export default function App(): React.JSX.Element {
  useDocumentMeta();
  useScrollToHash();

  return (
    <ThemeModeProvider>
      <GlobalStyles />

      <Container>
        <Header />
        <Home />
        <Footer />
      </Container>
    </ThemeModeProvider>
  );
}
