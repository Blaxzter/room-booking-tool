<script setup lang="ts">
// before mount get the client and get the static page that matches the route from backend
import { onBeforeMount, ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router'
import type { StaticPage } from '@/types'
import { useI18n } from 'vue-i18n'

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
      console.log(res.data.data)
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
</script>

<template>
  <div class="h-full px-4 py-6 lg:px-8 container mx-auto" v-if="page">
    <div class="static-content" v-html="page.content"></div>
  </div>
  <div class="h-full px-4 py-6 lg:px-8 flex justify-center items-center" v-else-if="loading">
    <div class="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
  </div>
</template>

<style scoped></style>

<style>
/* Unscoped styles that will affect content injected via v-html */
.static-content {
  /* Reset some Tailwind styles that might affect content */
  font-family: serif !important;
  color: #333 !important;
}

.static-content h1, 
.static-content h2, 
.static-content h3, 
.static-content h4 {
  font-weight: bold !important;
  color: #222 !important;
  margin-top: 1em !important;
  margin-bottom: 0.5em !important;
}

.static-content p {
  margin-bottom: 1em !important;
  line-height: 1.6 !important;
}

.static-content a {
  color: blue !important;
  text-decoration: underline !important;
}

.static-content ul, 
.static-content ol {
  padding-left: 2em !important;
  margin: 1em 0 !important;
}

.static-content ul li {
  list-style-type: disc !important;
}

.static-content ol li {
  list-style-type: decimal !important;
}

.static-content img {
  max-width: 100% !important;
}

.static-content table {
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 1em 0 !important;
}

.static-content table td,
.static-content table th {
  border: 1px solid #ddd !important;
  padding: 8px !important;
}
</style>
