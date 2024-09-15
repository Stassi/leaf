import typescript from '@rollup/plugin-typescript'
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
    typescript({
      exclude: ['rollup.config.ts'],
    }),
  ],
}

// eslint-disable-next-line import/no-default-export -- default export required by Rollup.js
export default rollupConfig
