import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules', '.aws-sam', 'backend/dist', 'backend/node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, prettier],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      'no-console': ['error', { allow: ['error', 'warn'] }],
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    },
  },
  {
    // Backend (Lambda) and build tooling run on Node, not in the browser.
    files: ['backend/**/*.ts', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
  },
]);
