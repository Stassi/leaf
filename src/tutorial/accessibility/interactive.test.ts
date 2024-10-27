import { activeElementClassName } from 'test-utilities/active-element-class-name.js'
import { expectOpenStreetMapTilesLoaded } from 'test-utilities/expect-loaded/open-street-map-tiles.js'
import { pressEnter } from 'test-utilities/keypress/enter.js'
import { pressTab } from 'test-utilities/keypress/tab.js'

describe('interactive accessibility tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto('http://localhost:3001/tutorial/accessibility/interactive')
  })

  describe('map', (): void => {
    // eslint-disable-next-line jest/prefer-lowercase-title -- official case
    describe('OpenStreetMap tiles', (): void => {
      /* eslint-disable-next-line jest/expect-expect --
         `expectOpenStreetMapTilesLoaded` returns assertions */
      it('should load', expectOpenStreetMapTilesLoaded())
    })

    describe('marker', (): void => {
      describe('on focus', (): void => {
        describe('on `Enter`-press', (): void => {
          it('should display popup text "Kyiv, Ukraine is the birthplace of Leaflet!"', async (): Promise<void> => {
            let markerFocused = false

            while (!markerFocused) {
              await pressTab()

              if (
                (await activeElementClassName()).includes('leaflet-marker-icon')
              ) {
                markerFocused = true
              }
            }

            await pressEnter()

            expect(
              await page.$eval(
                '.leaflet-popup-content',
                ({ textContent }: Element): string | null => textContent,
              ),
            ).toBe('Kyiv, Ukraine is the birthplace of Leaflet!')
          })
        })
      })
    })
  })
})
