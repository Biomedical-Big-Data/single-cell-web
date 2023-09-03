module.exports = {
  'env': {
    'browser': true, 'es2021': true
  },
  'extends': ['eslint:recommended', 'plugin:vue/vue3-essential', '@vue/eslint-config-prettier/skip-formatting', 'prettier'],
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest', 'sourceType': 'module'
  },
  'plugins': ['vue'],
  'rules': {}
}
