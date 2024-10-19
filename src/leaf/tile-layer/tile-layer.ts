import { type TileLayerOptions as LeafletTileLayerOptions } from 'leaflet'

import { type LayerGroup, type Map, type TileLayer } from '@stassi/leaf'

export type TileLayerOptions = {
  urlTemplate: string
} & Partial<
  LeafletTileLayerOptions & {
    map: Map | LayerGroup
    zoomMax: number
  }
>

export async function tileLayer({
  map,
  urlTemplate,
  zoomMax: maxZoom = 18,
  ...props
}: TileLayerOptions): Promise<TileLayer> {
  const created: TileLayer = (await import('leaflet')).tileLayer(urlTemplate, {
    maxZoom,
    ...props,
  })

  return map ? created.addTo(map) : created
}
