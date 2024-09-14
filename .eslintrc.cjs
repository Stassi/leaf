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
    'plugin:json/recommended-legacy',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist/'],
  overrides: [
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
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
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
  plugins: ['@typescript-eslint', 'prettier', 'json', 'import'],
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
