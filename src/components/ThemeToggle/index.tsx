import { useTranslation } from 'react-i18next';

import useThemeMode from '../../theme/useThemeMode';
import { Container } from './styles';

interface ThemeToggleProps {
  /** Also show the action as text (the mobile menu has room for it). */
  withLabel?: boolean;
}

const MOON = 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z';
const SUN_RAYS = 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41';

/** A button that switches between the light and dark theme. The icon shows where it will go. */
export default function ThemeToggle({ withLabel = false }: ThemeToggleProps): React.JSX.Element {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const label = mode === 'dark' ? t('theme.toLight') : t('theme.toDark');

  return (
    <Container
      type='button'
      aria-label={label}
      title={label}
      onClick={toggleMode}
    >
      <svg
        viewBox='0 0 24 24'
        width='18'
        height='18'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        focusable='false'
      >
        {mode === 'dark' ? (
          <>
            <circle
              cx='12'
              cy='12'
              r='4'
            />
            <path d={SUN_RAYS} />
          </>
        ) : (
          <path d={MOON} />
        )}
      </svg>
      {withLabel && <span>{label}</span>}
    </Container>
  );
}
