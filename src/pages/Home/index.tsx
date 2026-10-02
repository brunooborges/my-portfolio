import About from './components/About';
import Intro from './components/Intro';
import Portfolio from './components/Portfolio';

import { Container } from './styles';

export default function Home(): React.JSX.Element {
  return (
    <Container>
      <Intro id='intro' />
      <About id='about' />
      <Portfolio id='portfolio' />
    </Container>
  );
}
