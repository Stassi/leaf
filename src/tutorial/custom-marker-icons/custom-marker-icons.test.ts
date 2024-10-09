import { type ElementHandle } from 'puppeteer'

type SourceCustomMarkerIcons = string | null

describe('custom-marker-icons tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto(
      'http://localhost:3001/tutorial/custom-marker-icons/custom-marker-icons',
    )
  })

  describe('map', (): void => {
    describe('on initial page load', (): void => {
      // eslint-disable-next-line jest/prefer-lowercase-title -- official case
      describe('OpenStreetMap tiles', (): void => {
        it('should render', async (): Promise<void> => {
          ;(
            await page.$$eval(
              '.leaflet-tile-loaded',
              (tiles: Element[]): SourceCustomMarkerIcons[] =>
                tiles.map(
                  (tile: Element): SourceCustomMarkerIcons =>
                    tile.getAttribute('src'),
                ),
            )
          ).forEach((source: SourceCustomMarkerIcons): void => {
            expect(source).toMatch(/^https:\/\/tile\.openstreetmap\.org\//)
          })
        })
      })
    })

    describe('element displays popup text on click', (): void => {
      describe('markers with custom icons', (): void => {
        describe.each([
          {
            popupText: 'I am a green leaf.',
            src: 'image/green.png',
          },
          {
            popupText: 'I am an orange leaf.',
            src: 'image/orange.png',
          },
          {
            popupText: 'I am a red leaf.',
            src: 'image/red.png',
          },
        ])(
          'src="$src"',
          ({ popupText, src }: { popupText: string; src: string }): void => {
            it(`should display popup text "${popupText}"`, async (): Promise<void> => {
              const marker: ElementHandle<HTMLImageElement> | null =
                await page.$(`img[src="${src}"]`)
              if (!marker)
                throw new Error(`Element with src="${src}" not found.`)

              await marker.click()

              await page.waitForFunction(
                (expectedText: string): boolean =>
                  document.querySelector('.leaflet-popup-content')
                    ?.textContent === expectedText,
                {},
                popupText,
              )

              expect(
                await page.$eval(
                  '.leaflet-popup-content',
                  ({ textContent }: Element): SourceCustomMarkerIcons =>
                    textContent,
                ),
              ).toBe(popupText)
            })
          },
        )
      })
    })
  })
})
