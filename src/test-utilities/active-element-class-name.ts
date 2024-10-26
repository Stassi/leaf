export function activeElementClassName(): Promise<string> {
  return page.evaluate((): string => document.activeElement?.className ?? '')
}
