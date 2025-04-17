<script setup lang="ts" generic="TData, TValue">
import { ref } from 'vue'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, useVueTable, getPaginationRowModel, getSortedRowModel } from '@tanstack/vue-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DataTablePagination from '@/components/requests-components/DataTablePagination.vue'
import type { Booking } from '@/types'

import { valueUpdater } from '@/lib/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  columns: ColumnDef<Booking, TValue>[]
  data: Booking[]
}>()

const sorting = ref<SortingState>([])

const table = useVueTable<Booking>({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  state: {
    get sorting() {
      return sorting.value
    }
  },
  initialState: {
    pagination: {
      pageSize: 5
    }
  }
})
</script>

<template>
  <div>
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                {{ t('requestsComponents.dataTable.noResults') }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <div class="py-2">
      <DataTablePagination :table="table" />
    </div>
  </div>
</template>
