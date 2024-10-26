describe('decorative accessibility tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto('http://localhost:3001/tutorial/accessibility/decorative')
  })

  describe('map', (): void => {
    describe('marker', (): void => {
      describe('when repeatedly pressing Tab', (): void => {
        it('should not obtain focus', async (): Promise<void> => {
          const tabPressesMaximum = 20
          let markerFocused = false,
            tabPresses = 0

          while (tabPresses < tabPressesMaximum) {
            await page.keyboard.press('Tab')
            tabPresses++

            if (
              (
                await page.evaluate(
                  (): string => document.activeElement?.className ?? '',
                )
              ).includes('leaflet-marker-icon')
            ) {
              markerFocused = true
              break
            }
          }

          expect(markerFocused).toBe(false)
        })
      })
    })
  })
})
