import {
  type ErrorEventHandlerFn,
  type LocateOptions,
  type LocationEventHandlerFn,
  type Map,
} from 'leaflet'

import { map } from './map.js'

export type WorldLocatorMapOptions = {
  id: string | HTMLElement
  onLocate: LocationEventHandlerFn
  onLocateError: ErrorEventHandlerFn
} & Omit<LocateOptions, 'maxZoom' | 'setView'> &
  Partial<{
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
  return map({ id })
    .fitWorld()
    .locate({
      maxZoom,
      setView,
      ...props,
    })
    .on('locationerror', onLocateError)
    .on('locationfound', onLocate)
}