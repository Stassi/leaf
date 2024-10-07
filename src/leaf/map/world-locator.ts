import {
  type ErrorEventHandlerFn,
  type LocateOptions,
  type LocationEventHandlerFn,
  type Map,
} from 'leaflet'

import { map } from './map.js'

export type WorldLocatorMapOptions = LocateOptions & {
  id: string | HTMLElement
  onLocate: LocationEventHandlerFn
  onLocateError: ErrorEventHandlerFn
} & Partial<{
    setViewOnLocate: boolean
    zoomMaxOnLocate: number
  }>

export function worldLocator({
  id,
  onLocate,
  onLocateError,
  setViewOnLocate: setView,
  zoomMaxOnLocate: maxZoom,
  ...props
}: WorldLocatorMapOptions): Map {
  return map({ fitWorld: true, id, onLocate, onLocateError }).locate({
    maxZoom,
    setView,
    ...props,
  })
}
