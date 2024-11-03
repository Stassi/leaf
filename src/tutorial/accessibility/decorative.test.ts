import {
  activeElementClassName,
  expectImagesLoaded,
  expectOpenStreetMapTilesLoaded,
  pressTab,
  setBrowserConfiguration,
} from 'test-utilities'

describe('decorative accessibility tutorial', (): void => {
  describe.each([1, 2])(
    'device scale factor: %d',
    (deviceScaleFactor: number): void => {
      beforeAll(
        setBrowserConfiguration({
          deviceScaleFactor,
          url: 'http://localhost:3001/tutorial/dist/accessibility-decorative',
        }),
      )

      describe('map', (): void => {
        // eslint-disable-next-line jest/prefer-lowercase-title -- official case
        describe('OpenStreetMap tiles', (): void => {
          /* eslint-disable-next-line jest/expect-expect --
         `expectOpenStreetMapTilesLoaded` returns assertions */
          it('should load', expectOpenStreetMapTilesLoaded())
        })

        describe('marker', (): void => {
          describe('images', (): void => {
            describe.each([
              `../../../leaflet/images/marker-icon${deviceScaleFactor === 2 ? '-2x' : ''}.png`,
              '../../../leaflet/images/marker-shadow.png',
            ])('src="%s"', (src: string): void => {
              /* eslint-disable-next-line jest/expect-expect --
                 `expectImagesLoaded` returns assertions */
              it('should load', expectImagesLoaded(src))
            })
          })

          describe('on repeated `Tab`-presses', (): void => {
            it('should not obtain focus', async (): Promise<void> => {
              const tabPressesMaximum = 20
              let markerFocused = false,
                tabPresses = 0

              while (tabPresses < tabPressesMaximum) {
                await pressTab()
                tabPresses++

                if (
                  (await activeElementClassName()).includes(
                    'leaflet-marker-icon',
                  )
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
    },
  )
})
