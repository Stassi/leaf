import { clickFullscreenControl } from 'test-utilities/click/fullscreen-control.js'
import { pressEnter } from 'test-utilities/keypress/enter.js'

const fullscreenActiveClassName = 'leaflet-fullscreen-on'

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
      ? page.waitForSelector(`#map.${fullscreenActiveClassName}`)
      : page.waitForFunction(
          (): boolean =>
            !document
              .querySelector('#map')
              ?.classList.contains(fullscreenActiveClassName),
        ))

    expect(
      await page.$eval('#map', (element: Element): boolean =>
        element.classList.contains(fullscreenActiveClassName),
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
