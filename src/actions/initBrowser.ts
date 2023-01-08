import puppeteer from 'x/puppeteer@16.2.0/mod.ts'

export const initializeBrowser = async () => {
  try {
    console.log(`Downloading and launching browser...`)
    // Removed because it doesn't work with the compiled version of the CLI
    // since it tries do download the file and look for dependencies locally
    // For this to work we need to bundle the dependencies with the CLI through vendor
    // But the vendor command also gives me back other sorts of errors that I don't know how to fix
    // await import('https://deno.land/x/puppeteer@16.2.0/install.ts')
    return await puppeteer.launch({ headless: true })
  } catch (error) {
    console.error(`Error launching browser: ${error}`)
    Deno.exit(1)
  }
}
