import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
import './i18n';

const rootElement = document.getElementById('root');

if (rootElement != null) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element with ID 'root' not found in the document.");
}
