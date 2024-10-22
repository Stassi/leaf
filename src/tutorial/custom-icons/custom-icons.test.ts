describe('custom icons tutorial', (): void => {
  describe.each([1, 2])(
    'device scale factor: %d',
    (deviceScaleFactor: number): void => {
      beforeAll(async (): Promise<void> => {
        await page.setViewport({ deviceScaleFactor, height: 600, width: 800 })
        await page.goto('http://localhost:3001/tutorial/dist/custom-icons')
      })

      describe('map', (): void => {
        describe('element displays popup text on click', (): void => {
          describe('markers with custom icons', (): void => {
            function expectImagesLoaded(src: string): () => Promise<void> {
              return async (): Promise<void> => {
                await page.waitForFunction(
                  (imageSrc: string): boolean => {
                    return Array.from(
                      document.querySelectorAll<HTMLImageElement>(
                        `img[src="${imageSrc}"]`,
                      ),
                    ).every(
                      ({
                        complete,
                        naturalHeight,
                        naturalWidth,
                      }: HTMLImageElement): boolean =>
                        complete && naturalHeight > 0 && naturalWidth > 0,
                    )
                  },
                  undefined,
                  src,
                )

                for (const img of await page.$$(`img[src="${src}"]`)) {
                  expect(
                    await img.evaluate(
                      ({
                        complete,
                        naturalHeight,
                        naturalWidth,
                      }: HTMLImageElement): Record<
                        'complete' | 'heightModified' | 'widthModified',
                        boolean
                      > => ({
                        complete,
                        heightModified: naturalHeight > 0,
                        widthModified: naturalWidth > 0,
                      }),
                    ),
                  ).toEqual({
                    complete: true,
                    heightModified: true,
                    widthModified: true,
                  })
                }
              }
            }

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
              ({
                popupText,
                src,
              }: Record<'popupText' | 'src', string>): void => {
                /* eslint-disable-next-line jest/expect-expect --
                   `expectImageLoaded` returns assertions */
                it('should have loaded', expectImagesLoaded(src))

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
              },
            )

            describe('shadows', (): void => {
              /* eslint-disable-next-line jest/expect-expect --
                 `expectImageLoaded` returns assertions */
              it(
                'should have loaded',
                expectImagesLoaded('../custom-icons/image/shadow.png'),
              )
            })
          })
        })
      })
    },
  )
})
