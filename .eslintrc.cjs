module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2, { 'ImportDeclaration': 'off' }],
    'consistent-return': 'error',
    'nonblock-statement-body-position': ['error', 'below'],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        'allowSingleExtends': false
      }
    ],
  }
}
