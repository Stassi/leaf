import { type TileLayer } from 'leaflet'

import { tileLayer, type TileLayerOptions } from './tile-layer.js'

export type TileLayerOsmOptions = Omit<
  TileLayerOptions,
  'attribution' | 'urlTemplate'
>

export async function tileLayerOsm({
  ...props
}: TileLayerOsmOptions): Promise<TileLayer> {
  return tileLayer({
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    ...props,
  })
}
