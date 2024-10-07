type Source = string | null

describe('mobile tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await browser
      .defaultBrowserContext()
      .overridePermissions('http://localhost:3001', ['geolocation'])

    await page.setGeolocation({
      accuracy: 10,
      latitude: 51.505,
      longitude: -0.09,
    })

    await page.goto('http://localhost:3001/tutorial/mobile/mobile')
  })

  describe('map', (): void => {
    // eslint-disable-next-line jest/prefer-lowercase-title -- official case
    describe('OpenStreetMap tiles', (): void => {
      it('should render', async (): Promise<void> => {
        ;(
          await page.$$eval(
            '.leaflet-tile-loaded',
            (tiles: Element[]): Source[] =>
              tiles.map((tile: Element): Source => tile.getAttribute('src')),
          )
        ).forEach((source: Source): void => {
          expect(source).toMatch(/^https:\/\/tile\.openstreetmap\.org\//)
        })
      })
    })

    describe('layer', (): void => {
      describe('circle', (): void => {
        it('should render', async (): Promise<void> => {
          expect(await page.$('path.leaflet-interactive')).toBeDefined()
        })
      })

      describe('marker', (): void => {
        it('should render', async (): Promise<void> => {
          expect(await page.$('.leaflet-marker-icon')).toBeDefined()
        })
      })

      describe('popup text', (): void => {
        it('should display user location accuracy', async (): Promise<void> => {
          expect(
            await page.$eval(
              '.leaflet-popup-content',
              ({ textContent }: Element): Source => textContent,
            ),
          ).toBe('You are within 10 meters from this point.')
        })
      })
    })
  })
})
