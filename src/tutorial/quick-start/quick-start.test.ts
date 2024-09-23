// noinspection JSUnresolvedReference
import { type BoundingBox, type ElementHandle } from 'puppeteer'

describe('quick-start tutorial', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3001/tutorial/quick-start/quick-start')
  })

  describe('map', () => {
    describe('on initial page load', () => {
      // eslint-disable-next-line jest/prefer-lowercase-title -- official case
      describe('OpenStreetMap tiles', () => {
        it('should render', async () => {
          const selector = '.leaflet-tile-loaded'
          await page.waitForSelector(selector)

          const sources: (string | null)[] = await page.$$eval(
            selector,
            (tiles) => tiles.map((tile) => tile.getAttribute('src')),
          )

          sources.forEach((source: string | null) => {
            expect(source).toMatch(/^https:\/\/tile\.openstreetmap\.org\//)
          })
        })
      })

      describe('standalone popup', () => {
        it('should display text "I am a standalone popup."', async () => {
          const selector = '.leaflet-popup-content'
          await page.waitForSelector(selector)

          expect(
            await page.$eval(selector, ({ textContent }) => textContent),
          ).toBe('I am a standalone popup.')
        })
      })
    })

    describe('element displays popup text on click', () => {
      describe('map (element)', () => {
        it('should display clicked coordinates', async () => {
          const element: ElementHandle | null = await page.$('#map')
          if (!element) throw new Error('Element not found.')

          const boundingBox: BoundingBox | null = await element.boundingBox()
          if (!boundingBox) throw new Error('Element bounding box not found.')

          const { height, width, x, y }: BoundingBox = boundingBox
          await page.mouse.click(x + width / 2, y + height / 2)

          await page.waitForFunction(() =>
            document
              .querySelector('.leaflet-popup-content')
              ?.textContent?.match(/^You clicked the map at LatLng\(.+\)$/),
          )

          expect(
            await page.$eval('.leaflet-popup-content', (el) => el.textContent),
          ).toMatch(/^You clicked the map at LatLng\(.+\)$/)
        })
      })

      describe('layer', () => {
        describe('ui', () => {
          describe('marker in the Borough of Southwark, London', () => {
            it('should display popup text "Hello world!I am a popup."', async () => {
              const element: ElementHandle | null = await page.$(
                '.leaflet-marker-icon',
              )

              if (!element) throw new Error('Element not found.')
              await element.click()

              await page.waitForFunction(
                () =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'Hello world!I am a popup.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  (el) => el.textContent,
                ),
              ).toBe('Hello world!I am a popup.')
            })
          })
        })

        describe('vector', () => {
          describe('red circle over South Bank district, Lambeth, London', () => {
            it('should display popup text "I am a circle."', async () => {
              const element: ElementHandle<SVGPathElement> | null =
                await page.$('path.leaflet-interactive[stroke="red"]')

              if (!element) throw new Error('Element not found.')
              await element.click()

              await page.waitForFunction(
                () =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'I am a circle.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  (el) => el.textContent,
                ),
              ).toBe('I am a circle.')
            })
          })

          describe('blue polygon over London neighborhood Wapping', () => {
            it('should display popup text "I am a polygon."', async () => {
              const element: ElementHandle<SVGPathElement> | null =
                await page.$('path.leaflet-interactive[stroke="#3388ff"]')

              if (!element) throw new Error('Element not found.')
              await element.click()

              await page.waitForFunction(
                () =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === 'I am a polygon.',
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  (el) => el.textContent,
                ),
              ).toBe('I am a polygon.')
            })
          })
        })
      })
    })
  })
})
