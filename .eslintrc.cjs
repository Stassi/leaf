const { resolve: resolveFileName } = require

module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    resolveFileName('@vercel/style-guide/eslint/browser'),
    resolveFileName('@vercel/style-guide/eslint/node'),
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    '*.d.ts',
    'dist/',
    'public/dompurify',
    'public/leaf',
    'public/leaflet',
  ],
  overrides: [
    {
      env: {
        jest: true,
        'jest/globals': true,
      },
      extends: ['plugin:jest/recommended'],
      files: ['*.test.ts'],
      globals: {
        browser: true,
        context: true,
        jestPuppeteer: true,
        page: true,
        puppeteerConfig: true,
      },
      plugins: ['jest'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jest/no-duplicate-hooks': 'error',
        'jest/prefer-lowercase-title': 'error',
        'jest/unbound-method': 'error',
      },
    },
    {
      extends: [
        'plugin:jsonc/base',
        'plugin:jsonc/prettier',
        'plugin:jsonc/recommended-with-json',
      ],
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
    },
    {
      extends: [
        resolveFileName('@vercel/style-guide/eslint/typescript'),
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:import/typescript',
      ],
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'angle-bracket' },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
      },
    },
    {
      files: ['*.js', '*.ts'],
      plugins: ['no-unsanitized'],
      rules: {
        'no-unsanitized/method': 'error',
        'no-unsanitized/property': 'error',
      },
    },
    {
      extends: ['plugin:yml/prettier', 'plugin:yml/standard'],
      files: ['*.yaml', '*.yml'],
      parser: 'yaml-eslint-parser',
      plugins: ['yml'],
      rules: {
        'yml/quotes': ['error', { prefer: 'single' }],
        'yml/sort-keys': 'error',
      },
    },
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      plugins: ['@babel/plugin-syntax-import-attributes'],
    },
    requireConfigFile: false,
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  root: true,
  rules: {
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',
    'import/order': ['error', { 'newlines-between': 'always' }],
    'prettier/prettier': [
      'error',
      { semi: false, singleQuote: true, trailingComma: 'all' },
    ],
    'sort-keys': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: true,
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
}
