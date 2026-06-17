<script setup lang="ts">
// before mount get the client and get the static page that matches the route from backend
import { onBeforeMount, ref, watch } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router'
import type { StaticPage } from '@/types'
import { useI18n } from 'vue-i18n'

import LogoImage from '@/components/bits/LogoImage.vue'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher.vue'
import LegalLinks from '@/components/utils/LegalLinks.vue'

const route = useRoute()
const page = ref<StaticPage | null>(null)
const loading = ref(false)
const { locale } = useI18n()

export interface StaticPageResponse {
  data: StaticPage[]
}

const fetchStaticPage = async () => {
  loading.value = true

  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:8055'
    : `${window.location.origin}/api`

  let path = route.path
  // remove leading slash
  if (path.charAt(0) === '/') {
    path = path.slice(1)
  }

  // ISO 639-1 language code
  const language = locale.value.split('-')[0]

  await axios
    .get(`${backendUrl}/items/staticpages?filter[slug][_eq]=${path}&filter[language][_eq]=${language}`)
    .then(async (res: AxiosResponse<StaticPageResponse>) => {
      if (res.data.data.length > 0) {
        page.value = res.data.data[0]
      } else {
        // Try to fetch the default language version if the current language version doesn't exist
        return axios.get(`${backendUrl}/items/staticpages?filter[slug][_eq]=${path}`)
          .then((defaultRes: AxiosResponse<StaticPageResponse>) => {
            if (defaultRes.data.data.length > 0) {
              page.value = defaultRes.data.data[0]
            } else {
              // if no static page is found, redirect to 404
              router.push('/404')
            }
          })
      }
    })
    .catch(() => {
      // if there's an error, redirect to 404
      router.push('/404')
    })

  loading.value = false
}

onBeforeMount(async () => {
  await fetchStaticPage()
})

// Re-fetch the localized content when the user switches language
watch(locale, () => {
  fetchStaticPage()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <header class="border-b border-border">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <router-link to="/" class="flex items-center gap-3">
          <LogoImage widthHeight="w-8 h-8" />
          <span class="text-lg font-bold">BookiTool</span>
        </router-link>
        <LanguageSwitcher variant="ghost" :flagSize="20" />
      </div>
    </header>

    <main class="flex-1 container mx-auto w-full px-4 py-8">
      <article v-if="page" class="static-content mx-auto max-w-3xl" v-html="page.content"></article>
      <div v-else-if="loading" class="flex h-full items-center justify-center py-24">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
        ></div>
      </div>
    </main>

    <footer class="border-t border-border py-4">
      <LegalLinks />
    </footer>
  </div>
</template>

<style scoped>
/*
 * Styles for content injected via v-html. They are scoped to `.static-content`
 * and use the app's theme tokens so legal pages respect light/dark mode.
 * Class+element specificity beats Tailwind's preflight resets, so no !important.
 */
.static-content {
  line-height: 1.7;
}

.static-content :deep(h1),
.static-content :deep(h2),
.static-content :deep(h3),
.static-content :deep(h4) {
  font-weight: 700;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
  line-height: 1.3;
}

.static-content :deep(h1) {
  font-size: 1.875rem;
}
.static-content :deep(h2) {
  font-size: 1.5rem;
}
.static-content :deep(h3) {
  font-size: 1.25rem;
}
.static-content :deep(h4) {
  font-size: 1.125rem;
}

.static-content :deep(p) {
  margin-bottom: 1em;
}

.static-content :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}

.static-content :deep(ul),
.static-content :deep(ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}

.static-content :deep(ul li) {
  list-style-type: disc;
}

.static-content :deep(ol li) {
  list-style-type: decimal;
}

.static-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.static-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.static-content :deep(table td),
.static-content :deep(table th) {
  border: 1px solid var(--border);
  padding: 0.5rem;
}
</style>
