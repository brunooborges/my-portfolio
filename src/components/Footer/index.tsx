import { useTranslation } from 'react-i18next';

import { Container } from './styles';
import useFooter from './useFooter';

export default function Footer(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const { count } = useFooter();
  const year = new Date().getFullYear();
  const visitors = count === null ? null : new Intl.NumberFormat(i18n.resolvedLanguage).format(Number(count));

  return (
    <Container>
      <p>
        <span>{`${t('footer.credit')} © ${year}`}</span>
        {visitors !== null && <span>{` - ${t('footer.visitors', { visitors })}`}</span>}
      </p>
    </Container>
  );
}
