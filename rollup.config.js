import { babel } from '@rollup/plugin-babel';
import dotenv from 'dotenv';
dotenv.config();

export default {
  input: 'index.js',
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
