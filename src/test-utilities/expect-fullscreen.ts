import { clickFullscreenControl } from 'test-utilities/click/click-fullscreen-control.js'
import { pressEnter } from 'test-utilities/keypress/enter.js'

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
