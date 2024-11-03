// noinspection HtmlRequiredLangAttribute, JSUnusedGlobalSymbols

import {
  type OutputAsset,
  type OutputChunk,
  type Plugin,
  type RollupOptions,
} from 'rollup'
import alias, { type RollupAliasOptions } from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import html, {
  makeHtmlAttributes,
  type RollupHtmlTemplateOptions,
} from '@rollup/plugin-html'
import inject, { type RollupInjectOptions } from '@rollup/plugin-inject'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
// @ts-expect-error -- untyped plugin
import untypedModify from 'rollup-plugin-modify'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import styles from 'rollup-plugin-styles'

type ModifyOptions = {
  find: string | RegExp
  replace: string | ((match: string, element: string, value: string) => string)
}

const aliasOptions: RollupAliasOptions = {
    entries: [
      {
        find: /^leaflet$/,
        replacement: 'leaflet/dist/leaflet-src.esm.js',
      },
    ],
  },
  modifyOptions: ModifyOptions = {
    find: /(?<element>.*)\.innerHTML\s*=\s*(?<value>.*);/,
    replace: (_match: string, element: string, value: string): string =>
      `${element}.innerHTML = DOMPurify.sanitize(${value});`,
  },
  injectOptions: RollupInjectOptions = {
    DOMPurify: 'dompurify',
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- untyped plugin
  modify: (modifyOptions: ModifyOptions) => Plugin = untypedModify,
  rollupConfig: RollupOptions[] = [
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
        alias(aliasOptions),
        nodeResolve(),
        commonjs(),
        modify(modifyOptions),
        inject(injectOptions),
        typescript({
          declaration: true,
          exclude: [
            'rollup.config.ts',
            'src/test-utilities/**/*.ts',
            'src/tutorial/**/*.ts',
          ],
          outDir: './dist',
        }),
        terser(),
      ],
    },
    ...[
      {
        fileName: 'quick-start.html',
        input: 'src/tutorial/quick-start/quick-start.ts',
        title: 'Leaflet Quick Start Guide',
      },
      {
        fileName: 'mobile.html',
        input: 'src/tutorial/mobile/mobile.ts',
        title: 'Leaflet on Mobile',
      },
      {
        fileName: 'custom-icons.html',
        input: 'src/tutorial/custom-icons/custom-icons.ts',
        title: 'Markers With Custom Icons',
      },
      {
        fileName: 'accessibility-interactive.html',
        input: 'src/tutorial/accessibility/interactive.ts',
        title: 'Accessible maps: Interactive',
      },
      {
        fileName: 'accessibility-decorative.html',
        input: 'src/tutorial/accessibility/decorative.ts',
        title: 'Accessible maps: Decorative',
      },
    ].map(
      ({
        fileName,
        input,
        title,
      }: Record<'fileName' | 'input' | 'title', string>): RollupOptions => {
        return {
          input,
          output: {
            assetFileNames: 'style/[name][extname]',
            chunkFileNames: 'script/[name]-[hash].js',
            dir: 'public/tutorial/dist/',
            entryFileNames: 'script/[name].js',
            format: 'esm',
            sourcemap: true,
          },
          plugins: [
            alias(aliasOptions),
            nodeResolve(),
            commonjs(),
            modify(modifyOptions),
            inject(injectOptions),
            styles({
              mode: 'extract',
              sourceMap: true,
              url: { hash: false, publicPath: '../assets/' },
            }),
            typescript(),
            terser(),
            html({
              fileName,
              publicPath: './',
              template({
                attributes,
                files,
                meta,
                publicPath,
                title: templateTitle,
              }: RollupHtmlTemplateOptions): string {
                return `
                <!DOCTYPE html>
                <html${makeHtmlAttributes(<Record<string, string>>attributes.html)}>
                <head>
                  ${meta
                    .map(
                      (metaInput: Record<string, string>): string =>
                        `<meta${makeHtmlAttributes(metaInput)}>`,
                    )
                    .join('\n')}
                  <title>${templateTitle}</title>
                  ${(files.css ?? [])
                    .map(
                      ({
                        fileName: templateFileName,
                      }: OutputChunk | OutputAsset): string =>
                        `<link href="${publicPath}${templateFileName}" rel="stylesheet"${makeHtmlAttributes(<Record<string, string>>attributes.link)}>`,
                    )
                    .join('\n')}
                </head>
                <body>
                  <div id="map"></div>
                  ${(files.js ?? [])
                    .map(
                      ({
                        fileName: templateFileName,
                      }: OutputChunk | OutputAsset): string =>
                        `<script src="${publicPath}${templateFileName}"${makeHtmlAttributes(<Record<string, string>>attributes.script)}></script>`,
                    )
                    .join('\n')}
                </body>
                </html>
              `
              },
              title,
            }),
          ],
        }
      },
    ),
  ]

// eslint-disable-next-line import/no-default-export -- default export required by Rollup.js
export default rollupConfig
