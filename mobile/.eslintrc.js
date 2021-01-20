module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    // Uses the recommended rules
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/array-type': 'off',
    'react/display-name': 'off',
    'no-extra-boolean-cast': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  },
  globals: {
    require: true,
    fetch: true,
    Promise: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
