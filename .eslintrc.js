module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'coldsurfers', // for nodejs-typescript, or 'coldsurfers/nodejs-typescript'
    'coldsurfers/react-typescript', // for react-typescript
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // 'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': [0],
    'no-bitwise': 'off',
    camelcase: 'off',
    'no-param-reassign': 'off',
    'no-await-in-loop': 'off',
    'no-return-await': 'off',
    'react/no-array-index-key': 'off',
  },
}
