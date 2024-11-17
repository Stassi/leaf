import {
  type ControlOptions as LeafletControlOptions,
  control as untypedLeafletControl,
} from 'leaflet'

import { type Control, type ControlPosition, type Map } from '@stassi/leaf'

export type ControlOnAdd = (map: Map) => HTMLElement
export type ControlOptions = LeafletControlOptions &
  Partial<{
    map: Map
    onAdd: ControlOnAdd
    position: ControlPosition
  }>

export function control({
  map,
  onAdd,
  position = 'topright',
  ...props
}: ControlOptions): Control {
  const created: Control = (<(options: LeafletControlOptions) => Control>(
    (<unknown>untypedLeafletControl)
  ))({
    position,
    ...props,
  })

  if (onAdd) created.onAdd = onAdd

  return map ? created.addTo(map) : created
}
