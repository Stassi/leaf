import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { type RollupOptions } from 'rollup'

const rollupConfig: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/leaf.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript({
      exclude: ['rollup.config.ts'],
    }),
    terser(),
  ],
}

// eslint-disable-next-line import/no-default-export -- default export required by Rollup.js
export default rollupConfig
