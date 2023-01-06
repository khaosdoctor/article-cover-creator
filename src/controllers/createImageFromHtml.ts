import { Browser } from "https://deno.land/x/puppeteer@16.2.0/mod.ts"

export const createImageFromHTML = async (browserInstance: Browser, html: string) => {
  const page = await browserInstance.newPage()
  await page.setViewport({ width: 1440, height: 732 })
  await page.setContent(html)
  const image = await page.screenshot({ encoding: 'binary' })
  await page.close()
  return image
}
