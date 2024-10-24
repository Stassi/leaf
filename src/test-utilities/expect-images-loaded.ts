export function expectImagesLoaded(source: string): () => Promise<void> {
  return async (): Promise<void> => {
    await page.waitForFunction(
      (src: string): boolean => {
        return Array.from(document.querySelectorAll(`img[src="${src}"]`)).every(
          (img: Element): boolean =>
            img instanceof HTMLImageElement
              ? img.complete && img.naturalHeight > 0 && img.naturalWidth > 0
              : false,
        )
      },
      undefined,
      source,
    )

    for (const img of await page.$$(`img[src="${source}"]`)) {
      expect(
        await img.evaluate(
          ({
            complete,
            naturalHeight,
            naturalWidth,
          }: HTMLImageElement): boolean =>
            complete && naturalHeight > 0 && naturalWidth > 0,
        ),
      ).toBe(true)
    }
  }
}
