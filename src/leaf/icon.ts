import { type IconOptions as LeafletIconOptions } from 'leaflet'

import { type Icon } from '@stassi/leaf'

export type IconOptions = Omit<LeafletIconOptions, 'iconUrl'> &
  Partial<{
    iconUrl: string
  }>

export async function icon({
  iconUrl = 'marker-icon.png',
  iconRetinaUrl = 'marker-icon-2x.png',
  shadowUrl = 'marker-shadow.png',
  iconSize = [25, 41],
  iconAnchor = [12, 41],
  popupAnchor = [1, -34],
  tooltipAnchor = [16, -28],
  shadowSize = [41, 41],
  ...props
}: IconOptions): Promise<Icon> {
  return (await import('leaflet')).icon({
    iconAnchor,
    iconRetinaUrl,
    iconSize,
    iconUrl,
    popupAnchor,
    shadowSize,
    shadowUrl,
    tooltipAnchor,
    ...props,
  })
}
