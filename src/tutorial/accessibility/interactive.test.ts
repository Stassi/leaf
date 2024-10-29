import {
  activeElementClassName,
  expectImagesLoaded,
  expectOpenStreetMapTilesLoaded,
  pressEnter,
  pressTab,
  setBrowserConfiguration,
} from 'test-utilities'

describe('interactive accessibility tutorial', (): void => {
  describe.each([1, 2])(
    'device scale factor: %d',
    (deviceScaleFactor: number): void => {
      beforeAll(
        setBrowserConfiguration({
          deviceScaleFactor,
          url: 'http://localhost:3001/tutorial/dist/accessibility-interactive',
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

          describe('on focus', (): void => {
            describe('on `Enter`-press', (): void => {
              it('should display popup text "Kyiv, Ukraine is the birthplace of Leaflet!"', async (): Promise<void> => {
                let markerFocused = false

                while (!markerFocused) {
                  await pressTab()

                  if (
                    (await activeElementClassName()).includes(
                      'leaflet-marker-icon',
                    )
                  )
                    markerFocused = true
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
    },
  )
})
