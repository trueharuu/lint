/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  extends: [
    'plugin:@typescript-eslint/base',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  // ignorePatterns: ".eslintrc.js",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/array-type': [
      'warn',
      { default: 'generic', readonly: 'generic' },
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: ['enumMember'],
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': ['warn'],
    '@typescript-eslint/explicit-member-accessibility': ['warn'],
    '@typescript-eslint/strict-boolean-expressions': [
      'warn',
      {
        allowString: true,
        allowNumber: true,
        allowNullableObject: false,
        allowNullableBoolean: false,
        allowNullableString: false,
        allowNullableNumber: false,
        allowNullableEnum: false,
        allowAny: false,
      },
    ],

    quotes: ['warn', 'single'],
  },
};
