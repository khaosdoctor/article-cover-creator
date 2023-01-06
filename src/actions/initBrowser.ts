import puppeteer from 'x/puppeteer@16.2.0/mod.ts'

export const initializeBrowser = async () => {
  try {
    console.log(`Downloading and launching browser...`)
    await import('x/puppeteer@16.2.0/install.ts')
    return await puppeteer.launch({ headless: true })
  } catch (error) {
    console.error(`Error launching browser: ${error}`)
    Deno.exit(1)
  }
}
