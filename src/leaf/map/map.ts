import {
  type Map as LeafletMap,
  type MapOptions as LeafletMapOptions,
} from 'leaflet'

import {
  type CRS,
  type ErrorEventHandlerFn,
  type FitBoundsOptions,
  type Layer,
  type LeafletMouseEvent,
  type LeafletMouseEventHandlerFn,
  type LocateOptions,
  type LocationEvent,
  type LocationEventHandlerFn,
} from '@stassi/leaf'

type OnClick =
  | LeafletMouseEventHandlerFn
  | ((event: LeafletMouseEvent) => Promise<void>)
type OnLocate =
  | LocationEventHandlerFn
  | ((event: LocationEvent) => Promise<void>)

export type Map = LeafletMap & {
  on:
    | ((
        type:
          | 'click'
          | 'dblclick'
          | 'mousedown'
          | 'mouseup'
          | 'mouseover'
          | 'mouseout'
          | 'mousemove'
          | 'contextmenu'
          | 'preclick',
        fn: OnClick,
        context?: unknown,
      ) => void)
    | ((type: 'locationfound', fn: OnLocate, context?: unknown) => void)
}

export type MapOptions = LeafletMapOptions & {
  id: string | HTMLElement
} & Partial<{
    activeLayers: Layer[]
    crs: CRS
    dragging: boolean
    fitWorld: boolean
    fitWorldOptions: FitBoundsOptions
    locateOptions: LocateOptions
    onClick: OnClick
    onLocate: OnLocate
    onLocateError: ErrorEventHandlerFn
    zoomDelta: number
    zoomMax: number
    zoomMin: number
    zoomSnap: number
  }>

export async function map({
  activeLayers: layers,
  crs,
  dragging = true,
  fitWorld,
  fitWorldOptions = fitWorld ? {} : undefined,
  id: element,
  locateOptions,
  onClick,
  onLocate,
  onLocateError,
  zoomDelta = 1,
  zoomMax: maxZoom,
  zoomMin: minZoom,
  zoomSnap = 1,
  ...props
}: MapOptions): Promise<Map> {
  const created: Map = (await import('leaflet')).map(element, {
      crs: crs
        ? crs
        : (await import('../coordinate-reference-system/epsg-3857.js'))
            .epsg3857,
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
      : clickHandled,
    locationFoundHandled: Map = onLocate
      ? locationErrorHandled.on('locationfound', onLocate)
      : locationErrorHandled,
    located: Map = locateOptions
      ? locationFoundHandled.locate(locateOptions)
      : locationFoundHandled

  return fitWorldOptions ? located.fitWorld(fitWorldOptions) : located
}
