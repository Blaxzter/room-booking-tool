<script setup lang="ts">
// before mount get the client and get the static page that matches the route from backend
import { onBeforeMount, ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router'
import type { StaticPage } from '@/types'

const route = useRoute()
const page = ref<StaticPage | null>(null)
const loading = ref(false)

export interface StaticPageResponse {
  data: StaticPage[]
}

const fetchStaticPage = async () => {
  loading.value = true

  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:8055'
    : '/api'

  let path = route.path
  // remove leading slash
  if (path.charAt(0) === '/') {
    path = path.slice(1)
  }

  await axios
    .get(`${backendUrl}/items/staticpages?filter[slug][_eq]=${path}`)
    .then(async (res: AxiosResponse<StaticPageResponse>) => {
      console.log(res.data.data)
      if (res.data.data.length > 0) {
        page.value = res.data.data[0]
      } else {
        // if no static page is found, redirect to 404
        router.push('/404')
      }
    })

  loading.value = false
}

onBeforeMount(async () => {
  await fetchStaticPage()
})
</script>

<template>
  <div class="h-full px-4 py-6 lg:px-8" v-if="page">
    <div v-html="page.content"></div>
  </div>
</template>

<style scoped></style>
