// eslint-disable-next-line jest/prefer-lowercase-title -- official case
describe('OpenStreetMap tiles', (): void => {
  describe.each([
    'accessibility/interactive',
    'dist/custom-icons',
    'dist/mobile',
    'dist/quick-start',
  ])('tutorial: %s', (path: string): void => {
    it('should render', async (): Promise<void> => {
      await page.goto(`http://localhost:3001/tutorial/${path}`)
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
