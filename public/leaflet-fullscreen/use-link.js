import { DomEvent } from '../leaflet/leaflet-src.esm.js'

export function useLink(element) {
  return {
    assign(props) {
      Object.assign(element, props)
    },
    onClick(handler) {
      DomEvent.on(element, 'click', handler)
    },
  }
}
