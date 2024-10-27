import { type JSHandle } from 'puppeteer'

export function waitUntilMapClassFullscreenOff(): Promise<JSHandle<boolean>> {
  return page.waitForFunction(
    (): boolean =>
      !document
        .querySelector('#map')
        ?.classList.contains('leaflet-fullscreen-on'),
  )
}
