import { type BoundingBox, type ElementHandle } from 'puppeteer'

type Source = string | null

describe('quick-start tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto('http://localhost:3001/tutorial/quick-start/quick-start')
  })

  describe('map', (): void => {
    describe('on initial page load', (): void => {
      // eslint-disable-next-line jest/prefer-lowercase-title -- official case
      describe('OpenStreetMap tiles', (): void => {
        it('should render', async (): Promise<void> => {
          const sources: Source[] = await page.$$eval(
            '.leaflet-tile-loaded',
            (tiles: Element[]): Source[] =>
              tiles.map((tile: Element): Source => tile.getAttribute('src')),
          )

          sources.forEach((source: Source): void => {
            expect(source).toMatch(/^https:\/\/tile\.openstreetmap\.org\//)
          })
        })
      })

      describe('standalone popup', (): void => {
        it('should display text "I am a standalone popup."', async (): Promise<void> => {
          expect(
            await page.$eval(
              '.leaflet-popup-content',
              ({ textContent }: Element): Source => textContent,
            ),
          ).toBe('I am a standalone popup.')
        })
      })
    })

    describe('element displays popup text on click', (): void => {
      describe('map (element)', (): void => {
        it('should display clicked coordinates', async (): Promise<void> => {
          const element: ElementHandle | null = await page.$('#map')
          if (!element) throw new Error('Element not found.')

          const boundingBox: BoundingBox | null = await element.boundingBox()
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
              (el: Element): Source => el.textContent,
            ),
          ).toMatch(/^You clicked the map at LatLng\(.+\)$/)
        })
      })

      describe('layer', (): void => {
        describe('ui', (): void => {
          describe('marker in the Borough of Southwark, London', (): void => {
            it('should display popup text "Hello world!I am a popup."', async (): Promise<void> => {
              const element: ElementHandle | null = await page.$(
                '.leaflet-marker-icon',
              )

              if (!element) throw new Error('Element not found.')
              await element.click()

              await page.waitForFunction(
                (): boolean =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'Hello world!I am a popup.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  (el: Element): Source => el.textContent,
                ),
              ).toBe('Hello world!I am a popup.')
            })
          })
        })

        describe('vector', (): void => {
          describe('red circle over South Bank district, Lambeth, London', (): void => {
            it('should display popup text "I am a circle."', async (): Promise<void> => {
              const element: ElementHandle<SVGPathElement> | null =
                await page.$('path.leaflet-interactive[stroke="red"]')

              if (!element) throw new Error('Element not found.')
              await element.click()

              await page.waitForFunction(
                (): boolean =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'I am a circle.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  (el: Element): Source => el.textContent,
                ),
              ).toBe('I am a circle.')
            })
          })

          describe('blue polygon over London neighborhood Wapping', (): void => {
            it('should display popup text "I am a polygon."', async (): Promise<void> => {
              const element: ElementHandle<SVGPathElement> | null =
                await page.$('path.leaflet-interactive[stroke="#3388ff"]')

              if (!element) throw new Error('Element not found.')
              await element.click()

              await page.waitForFunction(
                (): boolean =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'I am a polygon.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  (el: Element): Source => el.textContent,
                ),
              ).toBe('I am a polygon.')
            })
          })
        })
      })
    })
  })
})
