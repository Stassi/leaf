import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { type RollupOptions } from 'rollup'

const rollupConfig: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
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
  ],
}

// eslint-disable-next-line import/no-default-export -- default export required by Rollup.js
export default rollupConfig
