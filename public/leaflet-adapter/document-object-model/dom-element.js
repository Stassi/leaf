import { DomUtility } from './dom-utility.js'

export function domElement({ name, style }) {
  const element = DomUtility.create(name)

  Object.assign(element.style, style)

  return {
    appendChild(node) {
      element.appendChild(node)
      return node
    },
    element,
    setInnerHtml(innerHtml) {
      // eslint-disable-next-line no-unsanitized/property -- TODO: Sanitize input
      element.innerHTML = innerHtml
      return innerHtml
    },
  }
}
