export function pressTab(): Promise<void> {
  return page.keyboard.press('Tab')
}
