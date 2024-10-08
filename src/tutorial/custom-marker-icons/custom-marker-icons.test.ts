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

      describe('markers with custom icons', (): void => {
        describe.each(['green', 'orange', 'red'])(
          'src="image/%s.png"',
          (iconColor: string): void => {
            it('should render', async (): Promise<void> => {
              expect(
                await page.$$eval(
                  '.leaflet-marker-icon',
                  (icons: Element[]): SourceCustomMarkerIcons[] =>
                    icons.map(
                      (icon: Element): SourceCustomMarkerIcons =>
                        icon.getAttribute('src'),
                    ),
                ),
              ).toContain(`image/${iconColor}.png`)
            })
          },
        )
      })
    })
  })
})
