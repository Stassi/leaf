import { DomEvent } from 'leaflet'

import { type LeafletDomEvent } from '@stassi/leaf'

export const stopEventPropagation: (
  event: DomEvent.PropagableEvent,
) => LeafletDomEvent = DomEvent.stopPropagation
