import { DomEvent } from 'leaflet'

import { type LeafletDomEvent } from '@stassi/leaf'

export const preventEventDefault: (event: Event) => LeafletDomEvent =
  DomEvent.preventDefault
