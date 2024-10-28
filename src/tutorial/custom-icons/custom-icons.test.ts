import {
  setBrowserConfiguration,
  expectOpenStreetMapTilesLoaded,
  expectImagesLoaded,
} from 'test-utilities'

describe('custom icons tutorial', (): void => {
  describe.each([1, 2])(
    'device scale factor: %d',
    (deviceScaleFactor: number): void => {
      beforeAll(
        setBrowserConfiguration({
          deviceScaleFactor,
          url: 'http://localhost:3001/tutorial/dist/custom-icons',
        }),
      )

      describe('map', (): void => {
        // eslint-disable-next-line jest/prefer-lowercase-title -- official case
        describe('OpenStreetMap tiles', (): void => {
          /* eslint-disable-next-line jest/expect-expect --
             `expectOpenStreetMapTilesLoaded` returns assertions */
          it('should load', expectOpenStreetMapTilesLoaded())
        })

        describe('markers with custom icons', (): void => {
          describe.each([
            {
              popupText: 'I am a green leaf.',
              src: '../custom-icons/image/green.png',
            },
            {
              popupText: 'I am an orange leaf.',
              src: '../custom-icons/image/orange.png',
            },
            {
              popupText: 'I am a red leaf.',
              src: '../custom-icons/image/red.png',
            },
          ])(
            'src="$src"',
            ({ popupText, src }: Record<'popupText' | 'src', string>): void => {
              /* eslint-disable-next-line jest/expect-expect --
                   `expectImageLoaded` returns assertions */
              it('should load', expectImagesLoaded(src))

              describe('on click', (): void => {
                it(`should display popup text "${popupText}"`, async (): Promise<void> => {
                  await (await page.$(`img[src="${src}"]`))?.click()

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
              })
            },
          )

          describe('shadows', (): void => {
            /* eslint-disable-next-line jest/expect-expect --
                 `expectImageLoaded` returns assertions */
            it(
              'should load',
              expectImagesLoaded('../custom-icons/image/shadow.png'),
            )
          })
        })
      })
    },
  )
})
