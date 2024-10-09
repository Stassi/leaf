// noinspection JSUnusedGlobalSymbols

import commonjs from '@rollup/plugin-commonjs'
import inject from '@rollup/plugin-inject'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
// @ts-expect-error -- untyped plugin
import untypedModify from 'rollup-plugin-modify'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { type Plugin, type RollupOptions } from 'rollup'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- untyped plugin
const modify: (modifyOptions: {
  find: string | RegExp
  replace: string | ((match: string, element: string, value: string) => string)
}) => Plugin = untypedModify

const rollupConfig: RollupOptions[] = [
  {
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
      modify({
        find: /(?<element>.*)\.innerHTML\s*=\s*(?<value>.*);/,
        replace: (_match: string, element: string, value: string): string =>
          `${element}.innerHTML = DOMPurify.sanitize(${value});`,
      }),
      inject({
        DOMPurify: 'dompurify',
      }),
      nodeResolve(),
      typescript({
        declaration: true,
        exclude: ['rollup.config.ts', 'src/tutorial/**/*.ts'],
        outDir: './dist',
      }),
      terser(),
    ],
  },
  {
    external: ['@stassi/leaf'],
    input: 'src/tutorial/quick-start/quick-start.ts',
    output: {
      file: 'public/tutorial/quick-start/dist/quick-start.js',
      format: 'esm',
      paths: {
        '@stassi/leaf': '../../../leaf/leaf.js',
      },
      sourcemap: true,
    },
    plugins: [typescript(), terser()],
  },
  {
    external: ['@stassi/leaf'],
    input: 'src/tutorial/mobile/mobile.ts',
    output: {
      file: 'public/tutorial/mobile/dist/mobile.js',
      format: 'esm',
      paths: {
        '@stassi/leaf': '../../../leaf/leaf.js',
      },
      sourcemap: true,
    },
    plugins: [typescript(), terser()],
  },
  {
    external: ['@stassi/leaf'],
    input: 'src/tutorial/custom-marker-icons/custom-marker-icons.ts',
    output: {
      file: 'public/tutorial/custom-marker-icons/dist/custom-marker-icons.js',
      format: 'esm',
      paths: {
        '@stassi/leaf': '../../../leaf/leaf.js',
      },
      sourcemap: true,
    },
    plugins: [typescript(), terser()],
  },
]

// eslint-disable-next-line import/no-default-export -- default export required by Rollup.js
export default rollupConfig
