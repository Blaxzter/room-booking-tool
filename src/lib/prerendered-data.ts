import type { StaticPage } from '@/types'

// Build-time data produced by scripts/pre-render-static-pages.js. The files are
// gitignored and may be absent (e.g. a fresh checkout that never ran the script),
// so we load them with import.meta.glob, which resolves to an empty set instead of
// failing the build when the file does not exist.

const pageModules = import.meta.glob<Record<string, Record<string, StaticPage>>>(
  '../assets/static-pages.generated.json',
  { eager: true, import: 'default' }
)

const settingsModules = import.meta.glob<{ displayLegal?: boolean; showBuyMeACoffee?: boolean }>(
  '../assets/global-settings.generated.json',
  { eager: true, import: 'default' }
)

/** Map of pre-rendered static pages: { [slug]: { [language]: StaticPage } } */
export const prerenderedStaticPages = (Object.values(pageModules)[0] ?? {}) as Record<
  string,
  Record<string, StaticPage>
>

/** Pre-rendered global settings (display_legal etc.), empty if not generated. */
export const prerenderedSettings = (Object.values(settingsModules)[0] ?? {}) as {
  displayLegal?: boolean
  showBuyMeACoffee?: boolean
}

/** Resolve a pre-rendered page by slug, preferring the given language. */
export function getPrerenderedPage(slug: string, language: string): StaticPage | null {
  const byLang = prerenderedStaticPages[slug]
  if (!byLang) return null
  return byLang[language] ?? Object.values(byLang)[0] ?? null
}
