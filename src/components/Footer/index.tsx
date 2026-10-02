import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

import { Container } from './styles';
import useFooter from './useFooter';

export default function Footer(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const { count } = useFooter();
  // The visit is counted on load (see useFooter); the number is only revealed once the
  // visitor reaches the end of the page, and stays once shown.
  const [ref, reachedEnd] = useInView({ triggerOnce: true });
  const year = new Date().getFullYear();
  const visitors = count === null ? null : new Intl.NumberFormat(i18n.resolvedLanguage).format(Number(count));

  return (
    <Container ref={ref}>
      <p>
        <span>{`${t('footer.credit')} © ${year}`}</span>
        {visitors !== null && reachedEnd && <span>{` - ${t('footer.visitors', { visitors })}`}</span>}
      </p>
    </Container>
  );
}
