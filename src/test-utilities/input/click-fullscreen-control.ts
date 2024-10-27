export function clickFullscreenControl(): Promise<void> {
  return page.click('.leaflet-control-fullscreen-button')
}
