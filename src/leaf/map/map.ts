import {
  map as leafletMap,
  type CRS,
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
    onClick: LeafletMouseEventHandlerFn
    zoomDelta: number
    zoomMax: number
    zoomMin: number
    zoomSnap: number
  }>

export function map({
  activeLayers: layers,
  crs = epsg3857,
  dragging = true,
  id: element,
  onClick,
  zoomDelta = 1,
  zoomMax: maxZoom,
  zoomMin: minZoom,
  zoomSnap = 1,
  ...props
}: MapOptions): Map {
  const created = leafletMap(element, {
    crs,
    dragging,
    layers,
    maxZoom,
    minZoom,
    zoomDelta,
    zoomSnap,
    ...props,
  })

  return onClick ? created.on('click', onClick) : created
}
