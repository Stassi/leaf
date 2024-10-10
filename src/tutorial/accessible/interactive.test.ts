describe('accessible interactive tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto('http://localhost:3001/tutorial/accessible/interactive')
  })

  describe('map', (): void => {
    describe('on initial page load', (): void => {
      // eslint-disable-next-line jest/prefer-lowercase-title -- official case
      describe('OpenStreetMap tiles', (): void => {
        it('should render', async (): Promise<void> => {
          ;(
            await page.$$eval(
              '.leaflet-tile-loaded',
              (tiles: Element[]): (string | null)[] =>
                tiles.map((tile: Element): string | null =>
                  tile.getAttribute('src'),
                ),
            )
          ).forEach((source: string | null): void => {
            expect(source).toMatch(/^https:\/\/tile\.openstreetmap\.org\//)
          })
        })
      })
    })

    describe('"Tab"-focused marker when "Enter" is pressed', (): void => {
      it('should display popup text "Kyiv, Ukraine is the birthplace of Leaflet!"', async (): Promise<void> => {
        let markerFocused = false

        while (!markerFocused) {
          await page.keyboard.press('Tab')

          if (
            (
              await page.evaluate(
                (): string => document.activeElement?.className ?? '',
              )
            ).includes('leaflet-marker-icon')
          ) {
            markerFocused = true
          }
        }

        await page.keyboard.press('Enter')

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
