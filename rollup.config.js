import { babel } from '@rollup/plugin-babel';

export default {
  input: 'build/index.js',
  output: [
    {
      file: 'build/es/index.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'build/umd/creditkey.js',
      format: 'umd',
      name: 'ck'
    },
  ],
  plugins: [babel({ babelHelpers: 'external' })]
}
