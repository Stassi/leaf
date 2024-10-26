import { type BoundingBox } from 'puppeteer'

import { expectImagesLoaded } from 'test-utilities/expect-images-loaded.js'

describe('quick start tutorial', (): void => {
  describe.each([1, 2])(
    'device scale factor: %d',
    (deviceScaleFactor: number): void => {
      beforeAll(async (): Promise<void> => {
        await page.setViewport({ deviceScaleFactor, height: 600, width: 800 })
        await page.goto('http://localhost:3001/tutorial/dist/quick-start')
      })

      describe('map', (): void => {
        describe('on initial page load', (): void => {
          describe('standalone popup', (): void => {
            it('should display text "I am a standalone popup."', async (): Promise<void> => {
              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  ({ textContent }: Element): string | null => textContent,
                ),
              ).toBe('I am a standalone popup.')
            })
          })

          describe('marker images', (): void => {
            describe.each([
              '../../../leaflet/images/marker-icon.png',
              '../../../leaflet/images/marker-shadow.png',
            ])('src="%s"', (src: string): void => {
              /* eslint-disable-next-line jest/expect-expect --
             `expectImagesLoaded` returns assertions */
              it('should load', expectImagesLoaded(src))
            })
          })
        })

        describe('element displays popup text on click', (): void => {
          describe('map (element)', (): void => {
            it('should display clicked coordinates', async (): Promise<void> => {
              const boundingBox: BoundingBox | null | undefined = await (
                await page.$('#map')
              )?.boundingBox()
              if (!boundingBox)
                throw new Error('Element bounding box not found.')

              const { height, width, x, y }: BoundingBox = boundingBox
              await page.mouse.click(x + width / 2, y + height / 2)

              await page.waitForFunction(
                (): RegExpMatchArray | null | undefined =>
                  document
                    .querySelector('.leaflet-popup-content')
                    ?.textContent?.match(
                      /^You clicked the map at LatLng\(.+\)$/,
                    ),
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  ({ textContent }: Element): string | null => textContent,
                ),
              ).toMatch(/^You clicked the map at LatLng\(.+\)$/)
            })
          })

          describe('layer', (): void => {
            describe.each([
              {
                category: 'ui',
                description: 'marker in the Borough of Southwark, London',
                popupText: 'Hello world!I am a popup.',
                selector: '.leaflet-marker-icon',
              },
              {
                category: 'vector',
                description:
                  'red circle over South Bank district, Lambeth, London',
                popupText: 'I am a circle.',
                selector: 'path.leaflet-interactive[stroke="red"]',
              },
              {
                category: 'vector',
                description: 'blue polygon over Wapping neighborhood, London',
                popupText: 'I am a polygon.',
                selector: 'path.leaflet-interactive[stroke="#3388ff"]',
              },
            ])(
              '[$category] $description',
              ({
                popupText,
                selector,
              }: Record<
                'category' | 'description' | 'popupText' | 'selector',
                string
              >): void => {
                it(`should display popup text "${popupText}"`, async (): Promise<void> => {
                  await (await page.$(selector))?.click()

                  await page.waitForFunction(
                    (textContent: string): boolean =>
                      document.querySelector('.leaflet-popup-content')
                        ?.textContent === textContent,
                    undefined,
                    popupText,
                  )

                  expect(
                    await page.$eval(
                      '.leaflet-popup-content',
                      ({ textContent }: Element): string | null => textContent,
                    ),
                  ).toBe(popupText)
                })
              },
            )
          })
        })
      })
    },
  )
})
