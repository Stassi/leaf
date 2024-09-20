// noinspection JSUnresolvedReference
import { type ElementHandle } from 'puppeteer'

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

  it('should display popup with text "I am a circle." when red circle is clicked', async () => {
    const circle: ElementHandle<SVGPathElement> | null = await page.$(
      'path.leaflet-interactive[stroke="red"]',
    )
    if (!circle) throw new Error('Circle element not found')
    await circle.click()

    await page.waitForFunction(
      () =>
        document.querySelector('.leaflet-popup-content')?.textContent ===
        'I am a circle.',
    )

    expect(
      await page.$eval('.leaflet-popup-content', (el) => el.textContent),
    ).toBe('I am a circle.')
  })
})
