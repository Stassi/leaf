import {
  tileLayer as leafletTileLayer,
  type LayerGroup,
  type Map,
  type TileLayer,
  type TileLayerOptions as LeafletTileLayerOptions,
} from 'leaflet'

export type TileLayerOptions = {
  urlTemplate: string
} & Partial<
  LeafletTileLayerOptions & {
    map: Map | LayerGroup
    zoomMax: number
  }
>

export function tileLayer({
  map,
  urlTemplate,
  zoomMax: maxZoom = 18,
  ...props
}: TileLayerOptions): TileLayer {
  const created = leafletTileLayer(urlTemplate, {
    maxZoom,
    ...props,
  })

  return map ? created.addTo(map) : created
}
