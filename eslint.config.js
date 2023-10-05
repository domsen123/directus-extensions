import antfu from '@antfu/eslint-config'

export default antfu({}, {}, {
  rules: {
    'antfu/top-level-function': 'off',
    'no-throw-literal': 'off',
  },
})
