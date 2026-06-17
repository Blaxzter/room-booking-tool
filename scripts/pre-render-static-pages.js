// Pulls static-page content + global settings from Directus at BUILD time and
// writes them to gitignored JSON files that get bundled into the build. This lets
// the static/legal pages be pre-rendered (and work without a live backend) instead
// of fetching at runtime. Run via `pnpm pre-render` (or implicitly by `pnpm generate`).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../src/assets')
const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8055'

fs.mkdirSync(outputDir, { recursive: true })

async function fetchGlobalSettings() {
  try {
    const res = await axios.get(`${backendUrl}/items/settings`)
    return {
      displayLegal: !!res.data.data.display_legal,
      showBuyMeACoffee: !!res.data.data.show_buy_me_a_coffee
    }
  } catch (error) {
    console.warn(`[pre-render] Could not fetch global settings (${error.message}). Using defaults.`)
    return { displayLegal: false, showBuyMeACoffee: true }
  }
}

async function fetchStaticPages() {
  try {
    const res = await axios.get(`${backendUrl}/items/staticpages`)
    // Map pages by slug then language: { [slug]: { [language]: page } }
    const pageMap = {}
    for (const page of res.data.data) {
      if (!pageMap[page.slug]) pageMap[page.slug] = {}
      pageMap[page.slug][page.language] = page
    }
    return pageMap
  } catch (error) {
    console.warn(`[pre-render] Could not fetch static pages (${error.message}). Writing empty set.`)
    return {}
  }
}

function write(file, data) {
  const target = path.join(outputDir, file)
  fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`[pre-render] wrote ${path.relative(process.cwd(), target)}`)
}

async function main() {
  console.log(`[pre-render] fetching from ${backendUrl} ...`)
  const [settings, pages] = await Promise.all([fetchGlobalSettings(), fetchStaticPages()])
  write('global-settings.generated.json', settings)
  write('static-pages.generated.json', pages)
  console.log(`[pre-render] done (${Object.keys(pages).length} page slug(s)).`)
}

main().catch((err) => {
  console.error('[pre-render] failed:', err)
  process.exit(1)
})
