import eslint from '@eslint/js';
import next from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      '@next/next': next,
    },
    rules: {},
  },
  {
    ignores: ['node_modules/', '.next/'],
  },
  {
    // Extend Next.js recommended config for TypeScript
    extends: [
      'plugin:@next/next/recommended',
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
    ],
  }
);
