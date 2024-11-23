import { clickFullscreenControl } from '../input/click-fullscreen-control'
import { pressEnter } from '../input/keypress/enter'

function expectFullscreen({
  action,
  active,
}: {
  action: 'click-control' | 'press-enter'
  active: boolean
}): () => Promise<void> {
  return async (): Promise<void> => {
    await (action === 'click-control' ? clickFullscreenControl : pressEnter)()

    await (active
      ? page.waitForSelector(`#map.leaflet-fullscreen-on`)
      : page.waitForFunction(
          (): boolean =>
            !document
              .querySelector('#map')
              ?.classList.contains('leaflet-fullscreen-on'),
        ))

    expect(
      await page.$eval('#map', (element: Element): boolean =>
        element.classList.contains('leaflet-fullscreen-on'),
      ),
    ).toBe(active)

    expect(
      await page.$eval(
        'a.leaflet-control-fullscreen-button',
        (element: Element): string | null => element.getAttribute('title'),
      ),
    ).toBe(active ? 'Exit fullscreen' : 'View fullscreen')
  }
}

export function expectFullscreenActiveOnControlClick(): () => Promise<void> {
  return expectFullscreen({
    action: 'click-control',
    active: true,
  })
}

export function expectFullscreenInactiveOnControlClick(): () => Promise<void> {
  return expectFullscreen({
    action: 'click-control',
    active: false,
  })
}

export function expectFullscreenActiveOnEnterPress(): () => Promise<void> {
  return expectFullscreen({
    action: 'press-enter',
    active: true,
  })
}

export function expectFullscreenInactiveOnEnterPress(): () => Promise<void> {
  return expectFullscreen({
    action: 'press-enter',
    active: false,
  })
}
