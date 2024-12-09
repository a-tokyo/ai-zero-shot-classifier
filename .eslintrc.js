module.exports = {
  extends: ['airbnb', 'plugin:import/typescript', 'prettier'],
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  plugins: ['react', '@typescript-eslint', 'import', 'prettier'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // disable undef rule in favor of typescript
    'no-undef': 'off',
    'import/prefer-default-export': 'off',
    'import/no-named-as-default-member': 'off',
    'jsx-a11y/label-has-associated-control': 0,
    'no-underscore-dangle': 0,
    'no-console': 1,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
  },
  globals: {
    window: true,
    document: true,
  },
};
