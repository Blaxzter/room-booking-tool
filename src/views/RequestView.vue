<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { columns } from '@/components/requests-components/column'
import DataTable from '@/components/requests-components/DataTable.vue'

import { useInitialDataStore } from '@/stores/initial'
import { useRequests } from '@/stores/requests'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'

const { fetchRequestViewData } = useInitialDataStore()
const { init_loading } = storeToRefs(useInitialDataStore())
const { requests } = storeToRefs(useRequests())

onMounted(async () => {
  await fetchRequestViewData()
})
</script>

<template>
  <div class="container py-10 mx-auto">
    <CalenderLoader :height="150" v-if="init_loading" />
    <DataTable :columns="columns" :data="requests" v-else />
  </div>
</template>
