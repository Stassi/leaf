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
              ({ textContent }: Element): string | null => textContent,
            ),
          ).toBe('You are within 10 meters from this point.')
        })
      })
    })
  })
})
