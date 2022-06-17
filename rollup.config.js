import babel from 'rollup-plugin-babel';

export default [
  {
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    input: 'index.js',
    output: [{
      file: 'build/index.js',
      format: 'cjs'
    }, {
      file: 'build/bundle.js',
      format: 'umd',
      name: 'ck',
    }]
  }
]
