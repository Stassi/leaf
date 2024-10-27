import { expectOpenStreetMapTilesLoaded } from 'test-utilities/expect/expect-loaded/open-street-map-tiles.js'

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

    await page.goto('http://localhost:3001/tutorial/dist/mobile')
  })

  describe('map', (): void => {
    // eslint-disable-next-line jest/prefer-lowercase-title -- official case
    describe('OpenStreetMap tiles', (): void => {
      /* eslint-disable-next-line jest/expect-expect --
         `expectOpenStreetMapTilesLoaded` returns assertions */
      it('should load', expectOpenStreetMapTilesLoaded())
    })

    describe('layer', (): void => {
      describe.each([
        {
          name: 'circle',
          selector: 'path.leaflet-interactive',
        },
        {
          name: 'marker',
          selector: '.leaflet-marker-icon',
        },
      ])('$name', ({ selector }: Record<'name' | 'selector', string>): void => {
        it('should render', async (): Promise<void> => {
          expect(await page.$(selector)).toBeDefined()
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
