import { DomEvent } from '../../leaflet/leaflet-src.esm.js'

export function useLink({ element, initialProps }) {
  function assign(props) {
    Object.assign(element, props)
  }

  assign(initialProps)

  return {
    assign,
    onClick(handler) {
      DomEvent.on(element, 'click', handler)
    },
  }
}
