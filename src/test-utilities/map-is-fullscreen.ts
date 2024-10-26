export function mapIsFullscreen(): Promise<boolean> {
  return page.$eval('#map', (element: Element): boolean =>
    element.classList.contains('leaflet-fullscreen-on'),
  )
}
