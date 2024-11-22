import { DomUtil } from 'leaflet'

export type DomElementOptions<T extends string> = {
  tag: T
} & Partial<{
  className: string
  container: HTMLElement
}>

export type DomElement<T extends string> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : HTMLElement

export function domElement<T extends string>({
  tag,
  className,
  container,
}: DomElementOptions<T>): DomElement<T> {
  return <DomElement<T>>DomUtil.create(tag, className, container)
}
