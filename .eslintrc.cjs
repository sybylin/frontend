module.exports = {
  root: true,

  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: ['.vue']
  },

  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'standard'
  ],

  plugins: [
    '@typescript-eslint',
    'vue'
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    'arrow-parens': 'off',
    'one-var': 'off',
    'no-void': 'off',

    'import/first': 'off',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/named': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-unused-vars': 'off',

    indent: ['error', 'tab'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    'except-parens': 'off',
    'no-return-assign': ['error', 'always'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    eqeqeq: ['error', 'always'],
    curly: ['error', 'multi-or-nest'],
    'multiline-ternary': ['error', 'always'],
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'no-console': process.env.NODE_ENV === 'production'
      ? 'error'
      : 'off',
    'no-debugger': process.env.NODE_ENV === 'production'
      ? 'error'
      : 'off',

    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/v-slot-style': 'off',
    'vue/html-indent': [
      'warn',
      'tab',
      { alignAttributesVertically: true }
    ],
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: { max: 5 },
        multiline: { max: 3 }
      }
    ],

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true }
    ]
  }
}
