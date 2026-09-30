/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the visitor counter Lambda (no trailing slash). Unset: the counter is hidden. */
  readonly VITE_VISITOR_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
