import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Sora', sans-serif;
}

/* The theme owns the page color. index.html paints a first-paint color on plain html, and root is
   more specific, so this wins whatever the stylesheet order. Without it that color stays when
   the theme changes, leaving a dark strip above the first panel in the light theme. */
:root {
  background: ${({ theme }) => theme.colors.background};
}

body {
  background: ${({ theme }) => theme.colors.background};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.light};
}

button {
  cursor: pointer;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* Clear the fixed header when jumping to a section from the navigation. */
#about {
  scroll-margin-top: 90px;
}

#portfolio {
  scroll-margin-top: 100px;
}

#contact {
  scroll-margin-top: 90px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;
