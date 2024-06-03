<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { columns } from '@/components/requests-components/column'
import DataTable from '@/components/requests-components/DataTable.vue'

import { useInitialDataStore } from '@/stores/initial'
import { useRequests } from '@/stores/requests'

const { fetchRequestViewData } = useInitialDataStore()
const { requests } = storeToRefs(useRequests())

onMounted(async () => {
  await fetchRequestViewData()
})
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable :columns="columns" :data="requests" />
  </div>
</template>
