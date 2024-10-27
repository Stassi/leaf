import { type ElementHandle } from 'puppeteer'

export function waitUntilMapClassFullscreenOn(): Promise<ElementHandle | null> {
  return page.waitForSelector('#map.leaflet-fullscreen-on')
}
