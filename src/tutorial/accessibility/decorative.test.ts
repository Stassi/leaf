import { activeElementClassName } from 'test-utilities/active-element-class-name.js'
import { expectOpenStreetMapTilesLoaded } from 'test-utilities/expect-loaded/open-street-map-tiles.js'
import { pressTab } from 'test-utilities/input/keypress/tab.js'

describe('decorative accessibility tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto('http://localhost:3001/tutorial/accessibility/decorative')
  })

  describe('map', (): void => {
    // eslint-disable-next-line jest/prefer-lowercase-title -- official case
    describe('OpenStreetMap tiles', (): void => {
      /* eslint-disable-next-line jest/expect-expect --
         `expectOpenStreetMapTilesLoaded` returns assertions */
      it('should load', expectOpenStreetMapTilesLoaded())
    })

    describe('marker', (): void => {
      describe('on repeated `Tab`-presses', (): void => {
        it('should not obtain focus', async (): Promise<void> => {
          const tabPressesMaximum = 20
          let markerFocused = false,
            tabPresses = 0

          while (tabPresses < tabPressesMaximum) {
            await pressTab()
            tabPresses++

            if (
              (await activeElementClassName()).includes('leaflet-marker-icon')
            ) {
              markerFocused = true
              break
            }
          }

          expect(markerFocused).toBe(false)
        })
      })
    })
  })
})
