import {
  type Content,
  type LatLngExpression,
  type Layer,
  type LayerGroup,
  type Map,
  type Polygon,
  type PolylineOptions,
  type Popup,
} from 'leaflet'

export type PolygonOptions = PolylineOptions & {
  latitudeLongitudes:
    | LatLngExpression[]
    | LatLngExpression[][]
    | LatLngExpression[][][]
} & Partial<{
    map: Map | LayerGroup
    popupContent: ((layer: Layer) => Content) | Content | Popup
  }>

export async function polygon({
  latitudeLongitudes,
  map,
  popupContent,
  ...props
}: PolygonOptions): Promise<Polygon> {
  const created: Polygon = (await import('leaflet')).polygon(
      latitudeLongitudes,
      props,
    ),
    prerendered: Polygon = popupContent
      ? created.bindPopup(popupContent)
      : created

  return map ? prerendered.addTo(map) : prerendered
}
