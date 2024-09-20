// noinspection JSUnresolvedReference

describe('quick-start tutorial', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3001/tutorial/quick-start/quick-start')
  })

  it('should display the map correctly', async () => {
    expect(await page.$('#map')).not.toBeNull()
  })

  it('should display the popup "I am a standalone popup." when first loaded', async () => {
    const leafletPopupContent = '.leaflet-popup-content'

    await page.waitForSelector(leafletPopupContent)

    expect(
      await page.$eval(leafletPopupContent, ({ textContent }) => textContent),
    ).toBe('I am a standalone popup.')
  })
})
