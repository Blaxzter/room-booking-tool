// scripts/pre-render-static-pages.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../src/assets')

// Make sure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function fetchGlobalSettings() {
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8055'
  try {
    console.log('Fetching global settings...')
    const response = await axios.get(`${backendUrl}/items/settings`)
    return {
      displayLegal: response.data.data.display_legal,
      showBuyMeACoffee: response.data.data.show_buy_me_a_coffee
    }
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return {
      displayLegal: false,
      showBuyMeACoffee: true
    }
  }
}

async function fetchAllStaticPages() {
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8055'
  try {
    console.log('Fetching static pages...')
    const response = await axios.get(`${backendUrl}/items/staticpages`)
    
    // Create a map of pages by slug and language
    const pageMap = {}
    response.data.data.forEach(page => {
      if (!pageMap[page.slug]) pageMap[page.slug] = {}
      pageMap[page.slug][page.language] = page
    })
    
    return pageMap
  } catch (error) {
    console.error('Error fetching static pages:', error)
    return {}
  }
}

async function main() {
  try {
    // Fetch both global settings and static pages in parallel
    const [globalSettings, staticPages] = await Promise.all([
      fetchGlobalSettings(),
      fetchAllStaticPages()
    ])
    
    // Write global settings to a file
    const settingsPath = path.join(outputDir, 'global-settings.json')
    fs.writeFileSync(
      settingsPath,
      JSON.stringify(globalSettings, null, 2),
      'utf-8'
    )
    console.log(`Global settings written to ${settingsPath}`)
    
    // Write static pages to a file
    const pagesPath = path.join(outputDir, 'static-pages.json')
    fs.writeFileSync(
      pagesPath,
      JSON.stringify(staticPages, null, 2),
      'utf-8'
    )
    console.log(`Static pages written to ${pagesPath}`)
    
    console.log('Pre-rendering complete!')
  } catch (error) {
    console.error('Error during pre-rendering:', error)
    process.exit(1)
  }
}

main() 