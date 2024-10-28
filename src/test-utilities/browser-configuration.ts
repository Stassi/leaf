export function setBrowserConfiguration({
  deviceScaleFactor = 1,
  url,
}: {
  url: string
} & Partial<{
  deviceScaleFactor: number
}>): () => Promise<void> {
  return async (): Promise<void> => {
    await page.evaluateOnNewDocument((devicePixelRatio: number): void => {
      Object.defineProperty(window, 'devicePixelRatio', {
        get: (): number => devicePixelRatio,
      })
    }, deviceScaleFactor)

    await page.setViewport({ deviceScaleFactor, height: 600, width: 800 })

    await page.goto(url)
  }
}
