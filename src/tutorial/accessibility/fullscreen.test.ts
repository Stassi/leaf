import {
  activeElementClassName,
  expectFullscreenActiveOnControlClick,
  expectFullscreenActiveOnEnterPress,
  expectFullscreenInactiveOnControlClick,
  expectFullscreenInactiveOnEnterPress,
  expectOpenStreetMapTilesLoaded,
  pressTab,
} from 'test-utilities'

describe('fullscreen accessibility tutorial', (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto('http://localhost:3001/tutorial/accessibility/fullscreen')
  })

  describe('map', (): void => {
    // eslint-disable-next-line jest/prefer-lowercase-title -- official case
    describe('OpenStreetMap tiles', (): void => {
      /* eslint-disable-next-line jest/expect-expect --
         `expectOpenStreetMapTilesLoaded` returns assertions */
      it('should load', expectOpenStreetMapTilesLoaded())
    })

    describe('fullscreen control', (): void => {
      describe('on first click', (): void => {
        /* eslint-disable-next-line jest/expect-expect --
           `expectFullscreenActiveOnControlClick` returns assertions */
        it(
          'should enter fullscreen mode',
          expectFullscreenActiveOnControlClick(),
        )

        describe('on second click', (): void => {
          /* eslint-disable-next-line jest/expect-expect --
             `expectFullscreenInactiveOnControlClick` returns assertions */
          it(
            'should exit fullscreen mode',
            expectFullscreenInactiveOnControlClick(),
          )
        })
      })

      describe('fullscreen control', (): void => {
        it('should have focus', async (): Promise<void> => {
          const tabPressesMaximum = 20
          let fullscreenButtonFocused = false,
            tabPresses = 0

          while (!fullscreenButtonFocused && tabPresses < tabPressesMaximum) {
            await pressTab()
            tabPresses++

            if (
              (await activeElementClassName()).includes(
                'leaflet-control-fullscreen-button',
              )
            )
              fullscreenButtonFocused = true
          }

          expect(fullscreenButtonFocused).toBe(true)
        })

        describe('on first `Enter`-press', (): void => {
          /* eslint-disable-next-line jest/expect-expect --
             `expectFullscreenActiveOnEnterPress` returns assertions */
          it(
            'should enter fullscreen mode',
            expectFullscreenActiveOnEnterPress(),
          )

          describe('on second `Enter`-press', (): void => {
            /* eslint-disable-next-line jest/expect-expect --
               `expectFullscreenInactiveOnEnterPress` returns assertions */
            it(
              'should exit fullscreen mode',
              expectFullscreenInactiveOnEnterPress(),
            )
          })
        })
      })
    })
  })
})
