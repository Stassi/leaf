import { expectOpenStreetMapTilesLoaded } from 'test-utilities/expect-open-street-map-tiles-loaded.js'

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
      describe('when repeatedly pressing Tab', (): void => {
        it('should not obtain focus', async (): Promise<void> => {
          const tabPressesMaximum = 20
          let markerFocused = false,
            tabPresses = 0

          while (tabPresses < tabPressesMaximum) {
            await page.keyboard.press('Tab')
            tabPresses++

            if (
              (
                await page.evaluate(
                  (): string => document.activeElement?.className ?? '',
                )
              ).includes('leaflet-marker-icon')
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
