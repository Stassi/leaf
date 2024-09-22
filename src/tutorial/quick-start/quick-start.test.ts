// noinspection JSUnresolvedReference
import { type ElementHandle } from 'puppeteer'

describe('quick-start tutorial', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3001/tutorial/quick-start/quick-start')
  })

  describe('map', () => {
    describe('on initial page load', () => {
      it('should display a Leaflet container', async () => {
        expect(await page.$('#map.leaflet-container')).not.toBeNull()
      })

      describe('standalone popup', () => {
        it('should display text "I am a standalone popup."', async () => {
          const leafletPopupContent = '.leaflet-popup-content'

          await page.waitForSelector(leafletPopupContent)

          expect(
            await page.$eval(
              leafletPopupContent,
              ({ textContent }) => textContent,
            ),
          ).toBe('I am a standalone popup.')
        })
      })
    })

    describe('element displays popup text on click', () => {
      describe('ui layer', () => {
        describe('marker in the Borough of Southwark, London', () => {
          it('should display popup text "I am a popup."', async () => {
            const element: ElementHandle | null = await page.$(
              '.leaflet-marker-icon',
            )
            if (!element) throw new Error('Element not found.')

            await element.click()

            await page.waitForSelector('.leaflet-popup-content')

            expect(
              await page.$eval(
                '.leaflet-popup-content',
                (el) => el.textContent,
              ),
            ).toBe('I am a standalone popup.')
          })
        })
      })

      describe('vector layer', () => {
        describe('red circle over South Bank district, Lambeth, London', () => {
          it('should display popup text "I am a circle."', async () => {
            const element: ElementHandle<SVGPathElement> | null = await page.$(
              'path.leaflet-interactive[stroke="red"]',
            )
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
            const element: ElementHandle<SVGPathElement> | null = await page.$(
              'path.leaflet-interactive[stroke="#3388ff"]',
            )
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
