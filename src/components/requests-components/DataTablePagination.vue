<script setup lang="ts">
import { type Table } from '@tanstack/vue-table'
import type { Booking } from '@/types'
import { ChevronsRightIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { t } = useI18n()

interface DataTablePaginationProps {
  table: Table<Booking>
}
const props = defineProps<DataTablePaginationProps>()

const selectPageSize = (value: string) => {
  props.table.setPageSize(Number(value))
}
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ t('requestsComponents.dataTablePagination.rowsSelected', {
        selected: table.getFilteredSelectedRowModel().rows.length,
        total: table.getFilteredRowModel().rows.length
      }) }}
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">{{ t('requestsComponents.dataTablePagination.rowsPerPage') }}</p>
        <Select :model-value="`${table.getState().pagination.pageSize}`" @update:model-value="selectPageSize">
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [5, 10, 20, 30, 40, 50]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        {{ t('requestsComponents.dataTablePagination.page', {
          current: table.getState().pagination.pageIndex + 1,
          total: table.getPageCount()
        }) }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">{{ t('requestsComponents.dataTablePagination.goToFirstPage') }}</span>
          <ChevronsLeftIcon class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">{{ t('requestsComponents.dataTablePagination.goToPreviousPage') }}</span>
          <ChevronLeftIcon class="w-4 h-4" />
        </Button>
        <Button variant="outline" class="w-8 h-8 p-0" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          <span class="sr-only">{{ t('requestsComponents.dataTablePagination.goToNextPage') }}</span>
          <ChevronRightIcon class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">{{ t('requestsComponents.dataTablePagination.goToLastPage') }}</span>
          <ChevronsRightIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
