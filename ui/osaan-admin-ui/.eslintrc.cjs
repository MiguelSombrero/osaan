module.exports = {
  root: true,
  ignorePatterns: ['skill-api.yaml', '**/skill-api.yaml'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  settings: { react: { version: 'detect' } },

  rules: {
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
  },

  overrides: [
    {
      files: ['backend/**/*.{js,ts}'],
      env: { node: true },
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
