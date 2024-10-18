// noinspection HtmlRequiredLangAttribute, JSUnusedGlobalSymbols

import {
  type OutputAsset,
  type OutputChunk,
  type Plugin,
  type RollupOptions,
} from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import html, {
  makeHtmlAttributes,
  type RollupHtmlTemplateOptions,
} from '@rollup/plugin-html'
import inject from '@rollup/plugin-inject'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
// @ts-expect-error -- untyped plugin
import untypedModify from 'rollup-plugin-modify'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import styles from 'rollup-plugin-styles'

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
        dir: 'dist/',
        entryFileNames: 'leaf.js',
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
    input: 'src/tutorial/quick-start/quick-start.ts',
    output: {
      assetFileNames: 'style/[name][extname]',
      chunkFileNames: 'script/[name]-[hash].js',
      dir: 'public/tutorial/dist/',
      entryFileNames: 'script/[name].js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      styles({
        mode: 'extract',
        sourceMap: true,
        url: { hash: false, publicPath: '../assets/' },
      }),
      typescript(),
      terser(),
      html({
        fileName: 'quick-start.html',
        publicPath: './',
        template({
          attributes,
          files,
          meta,
          publicPath,
          title,
        }: RollupHtmlTemplateOptions): string {
          return `
            <!DOCTYPE html>
            <html${makeHtmlAttributes(<Record<string, string>>attributes.html)}>
            <head>
              ${meta
                .map(
                  (input: Record<string, string>): string =>
                    `<meta${makeHtmlAttributes(input)}>`,
                )
                .join('\n')}
              <title>${title}</title>
              ${(files.css ?? [])
                .map(
                  ({ fileName }: OutputChunk | OutputAsset): string =>
                    `<link href="${publicPath}${fileName}" rel="stylesheet"${makeHtmlAttributes(<Record<string, string>>attributes.link)}>`,
                )
                .join('\n')}
            </head>
            <body>
              <div id="map"></div>
              ${(files.js ?? [])
                .map(
                  ({ fileName }: OutputChunk | OutputAsset): string =>
                    `<script src="${publicPath}${fileName}"${makeHtmlAttributes(<Record<string, string>>attributes.script)}></script>`,
                )
                .join('\n')}
            </body>
            </html>
          `
        },
        title: 'Leaflet Quick Start Guide',
      }),
    ],
  },
  {
    input: 'src/tutorial/mobile/mobile.ts',
    output: {
      assetFileNames: 'style/[name][extname]',
      chunkFileNames: 'script/[name]-[hash].js',
      dir: 'public/tutorial/dist/',
      entryFileNames: 'script/[name].js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      styles({
        mode: 'extract',
        sourceMap: true,
        url: { hash: false, publicPath: '../assets/' },
      }),
      typescript(),
      terser(),
      html({
        fileName: 'mobile.html',
        meta: [
          { charset: 'utf-8' },
          {
            content:
              'initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width',
            name: 'viewport',
          },
        ],
        publicPath: './',
        template({
          attributes,
          files,
          meta,
          publicPath,
          title,
        }: RollupHtmlTemplateOptions): string {
          return `
            <!DOCTYPE html>
            <html${makeHtmlAttributes(<Record<string, string>>attributes.html)}>
            <head>
              ${meta
                .map(
                  (input: Record<string, string>): string =>
                    `<meta${makeHtmlAttributes(input)}>`,
                )
                .join('\n')}
              <title>${title}</title>
              ${(files.css ?? [])
                .map(
                  ({ fileName }: OutputChunk | OutputAsset): string =>
                    `<link href="${publicPath}${fileName}" rel="stylesheet"${makeHtmlAttributes(<Record<string, string>>attributes.link)}>`,
                )
                .join('\n')}
            </head>
            <body>
              <div id="map"></div>
              ${(files.js ?? [])
                .map(
                  ({ fileName }: OutputChunk | OutputAsset): string =>
                    `<script src="${publicPath}${fileName}"${makeHtmlAttributes(<Record<string, string>>attributes.script)}></script>`,
                )
                .join('\n')}
            </body>
            </html>
          `
        },
        title: 'Markers With Custom Icons',
      }),
    ],
  },
  {
    input: 'src/tutorial/custom-icons/custom-icons.ts',
    output: {
      assetFileNames: 'style/[name][extname]',
      chunkFileNames: 'script/[name]-[hash].js',
      dir: 'public/tutorial/dist/',
      entryFileNames: 'script/[name].js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      styles({
        mode: 'extract',
        sourceMap: true,
        url: { hash: false, publicPath: '../assets/' },
      }),
      typescript(),
      terser(),
      html({
        fileName: 'custom-icons.html',
        publicPath: './',
        template({
          attributes,
          files,
          meta,
          publicPath,
          title,
        }: RollupHtmlTemplateOptions): string {
          return `
            <!DOCTYPE html>
            <html${makeHtmlAttributes(<Record<string, string>>attributes.html)}>
            <head>
              ${meta
                .map(
                  (input: Record<string, string>): string =>
                    `<meta${makeHtmlAttributes(input)}>`,
                )
                .join('\n')}
              <title>${title}</title>
              ${(files.css ?? [])
                .map(
                  ({ fileName }: OutputChunk | OutputAsset): string =>
                    `<link href="${publicPath}${fileName}" rel="stylesheet"${makeHtmlAttributes(<Record<string, string>>attributes.link)}>`,
                )
                .join('\n')}
            </head>
            <body>
              <div id="map"></div>
              ${(files.js ?? [])
                .map(
                  ({ fileName }: OutputChunk | OutputAsset): string =>
                    `<script src="${publicPath}${fileName}"${makeHtmlAttributes(<Record<string, string>>attributes.script)}></script>`,
                )
                .join('\n')}
            </body>
            </html>
          `
        },
        title: 'Markers With Custom Icons',
      }),
    ],
  },
]

// eslint-disable-next-line import/no-default-export -- default export required by Rollup.js
export default rollupConfig
