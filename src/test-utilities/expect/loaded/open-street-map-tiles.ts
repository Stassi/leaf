export function expectOpenStreetMapTilesLoaded(): () => Promise<void> {
  return async (): Promise<void> => {
    ;(
      await page.$$eval(
        '.leaflet-tile-loaded',
        (tiles: Element[]): (string | null)[] =>
          tiles.map((tile: Element): string | null => tile.getAttribute('src')),
      )
    ).forEach((source: string | null): void => {
      expect(source).toMatch(/^https:\/\/tile\.openstreetmap\.org\//)
    })
  }
}
