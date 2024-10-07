import {
  map as leafletMap,
  type CRS,
  type ErrorEventHandlerFn,
  type FitBoundsOptions,
  type Layer,
  type LeafletMouseEventHandlerFn,
  type Map,
  type MapOptions as LeafletMapOptions,
} from 'leaflet'

import { epsg3857 } from '../coordinate-reference-system/epsg-3857.js'

export type MapOptions = LeafletMapOptions & {
  id: string | HTMLElement
} & Partial<{
    activeLayers: Layer[]
    crs: CRS
    dragging: boolean
    fitWorld: boolean
    fitWorldOptions: FitBoundsOptions
    onClick: LeafletMouseEventHandlerFn
    onLocateError: ErrorEventHandlerFn
    zoomDelta: number
    zoomMax: number
    zoomMin: number
    zoomSnap: number
  }>

export function map({
  activeLayers: layers,
  crs = epsg3857,
  dragging = true,
  fitWorld,
  fitWorldOptions = fitWorld ? {} : undefined,
  id: element,
  onClick,
  onLocateError,
  zoomDelta = 1,
  zoomMax: maxZoom,
  zoomMin: minZoom,
  zoomSnap = 1,
  ...props
}: MapOptions): Map {
  const created: Map = leafletMap(element, {
      crs,
      dragging,
      layers,
      maxZoom,
      minZoom,
      zoomDelta,
      zoomSnap,
      ...props,
    }),
    clickHandled: Map = onClick ? created.on('click', onClick) : created,
    locationErrorHandled: Map = onLocateError
      ? clickHandled.on('locationerror', onLocateError)
      : clickHandled

  return fitWorldOptions
    ? locationErrorHandled.fitWorld(fitWorldOptions)
    : locationErrorHandled
}
