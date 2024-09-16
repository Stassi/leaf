// noinspection JSUnresolvedReference

describe('quick-start tutorial', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/tutorial/quick-start/quick-start')
  })

  it('should display the map correctly', async () => {
    const mapContainer = await page.$('#map')
    expect(mapContainer).not.toBeNull()
  })

  it('should display the popup "I am a standalone popup." when first loaded', async () => {
    const leafletPopupContent = '.leaflet-popup-content'

    await page.waitForSelector(leafletPopupContent)

    const popupContent: string | null = await page.$eval(
      leafletPopupContent,
      ({ textContent }) => textContent,
    )

    expect(popupContent).toBe('I am a standalone popup.')
  })
})