import { type BoundingBox } from 'puppeteer'

type SourceQuickstart = string | null

describe('quick-start tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto('http://localhost:3001/tutorial/quick-start/quick-start')
  })

  describe('map', (): void => {
    describe('on initial page load', (): void => {
      // eslint-disable-next-line jest/prefer-lowercase-title -- official case
      describe('OpenStreetMap tiles', (): void => {
        it('should render', async (): Promise<void> => {
          ;(
            await page.$$eval(
              '.leaflet-tile-loaded',
              (tiles: Element[]): SourceQuickstart[] =>
                tiles.map(
                  (tile: Element): SourceQuickstart => tile.getAttribute('src'),
                ),
            )
          ).forEach((source: SourceQuickstart): void => {
            expect(source).toMatch(/^https:\/\/tile\.openstreetmap\.org\//)
          })
        })
      })

      describe('standalone popup', (): void => {
        it('should display text "I am a standalone popup."', async (): Promise<void> => {
          expect(
            await page.$eval(
              '.leaflet-popup-content',
              ({ textContent }: Element): SourceQuickstart => textContent,
            ),
          ).toBe('I am a standalone popup.')
        })
      })
    })

    describe('element displays popup text on click', (): void => {
      describe('map (element)', (): void => {
        it('should display clicked coordinates', async (): Promise<void> => {
          const boundingBox: BoundingBox | null | undefined = await (
            await page.$('#map')
          )?.boundingBox()
          if (!boundingBox) throw new Error('Element bounding box not found.')

          const { height, width, x, y }: BoundingBox = boundingBox
          await page.mouse.click(x + width / 2, y + height / 2)

          await page.waitForFunction((): RegExpMatchArray | null | undefined =>
            document
              .querySelector('.leaflet-popup-content')
              ?.textContent?.match(/^You clicked the map at LatLng\(.+\)$/),
          )

          expect(
            await page.$eval(
              '.leaflet-popup-content',
              ({ textContent }: Element): SourceQuickstart => textContent,
            ),
          ).toMatch(/^You clicked the map at LatLng\(.+\)$/)
        })
      })

      describe('layer', (): void => {
        describe('ui', (): void => {
          describe('marker in the Borough of Southwark, London', (): void => {
            it('should display popup text "Hello world!I am a popup."', async (): Promise<void> => {
              await (await page.$('.leaflet-marker-icon'))?.click()

              await page.waitForFunction(
                (): boolean =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'Hello world!I am a popup.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  ({ textContent }: Element): SourceQuickstart => textContent,
                ),
              ).toBe('Hello world!I am a popup.')
            })
          })
        })

        describe('vector', (): void => {
          describe('red circle over South Bank district, Lambeth, London', (): void => {
            it('should display popup text "I am a circle."', async (): Promise<void> => {
              await (
                await page.$('path.leaflet-interactive[stroke="red"]')
              )?.click()

              await page.waitForFunction(
                (): boolean =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'I am a circle.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  ({ textContent }: Element): SourceQuickstart => textContent,
                ),
              ).toBe('I am a circle.')
            })
          })

          describe('blue polygon over London neighborhood Wapping', (): void => {
            it('should display popup text "I am a polygon."', async (): Promise<void> => {
              await (
                await page.$('path.leaflet-interactive[stroke="#3388ff"]')
              )?.click()

              await page.waitForFunction(
                (): boolean =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'I am a polygon.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  ({ textContent }: Element): SourceQuickstart => textContent,
                ),
              ).toBe('I am a polygon.')
            })
          })
        })
      })
    })
  })
})
