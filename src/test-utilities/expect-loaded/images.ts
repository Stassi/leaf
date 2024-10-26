import { type ElementHandle } from 'puppeteer'

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

    const images: ElementHandle<HTMLImageElement>[] = await page.$$(
      `img[src="${source}"]`,
    )

    expect(images.length).toBeGreaterThan(0)

    for (const image of images) {
      expect(
        await image.evaluate(
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
