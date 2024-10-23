import { type IconOptions as LeafletIconOptions } from 'leaflet'

import { type Icon } from '@stassi/leaf'

export type IconOptions = Omit<LeafletIconOptions, 'iconUrl'> &
  Partial<Record<'iconUrl' | 'iconUrlRetina' | 'shadowUrlRetina', string>>

export async function icon({
  iconAnchor = [12, 41],
  iconSize = [25, 41],
  iconUrl = 'marker-icon.png',
  iconUrlRetina = 'marker-icon-2x.png',
  popupAnchor = [1, -34],
  shadowSize = [41, 41],
  shadowUrl = 'marker-shadow.png',
  shadowUrlRetina = shadowUrl,
  tooltipAnchor = [16, -28],
  ...props
}: IconOptions): Promise<Icon> {
  return (await import('leaflet')).icon({
    iconAnchor,
    iconRetinaUrl: iconUrlRetina,
    iconSize,
    iconUrl,
    popupAnchor,
    shadowRetinaUrl: shadowUrlRetina,
    shadowSize,
    shadowUrl,
    tooltipAnchor,
    ...props,
  })
}
