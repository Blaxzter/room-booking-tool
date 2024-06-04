import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Booking } from '@/types'
import RequestAction from '@/components/requests-components/RequestAction.vue'

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => h('div', {}, row.getValue('id'))
  },
  {
    accessorKey: 'bookable_object_id',
    header: 'Bookable Object ID',
    cell: ({ row }) => h('div', {}, row.getValue('bookable_object_id'))
  },
  {
    accessorKey: 'created_user_id',
    header: 'Created User ID',
    cell: ({ row }) => h('div', {}, row.getValue('created_user_id'))
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => h('div', {}, new Date(row.getValue('start_date')).toLocaleDateString())
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => h('div', {}, new Date(row.getValue('end_date')).toLocaleDateString())
  },
  {
    accessorKey: 'is_full_day',
    header: 'Full Day',
    cell: ({ row }) => h('div', {}, row.getValue('is_full_day') ? 'Yes' : 'No')
  },
  {
    accessorKey: 'display_name',
    header: 'Display Name',
    cell: ({ row }) => h('div', {}, row.getValue('display_name') || 'N/A')
  },
  {
    accessorKey: 'mail',
    header: 'Email',
    cell: ({ row }) => h('div', {}, row.getValue('mail'))
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => h('div', {}, row.getValue('phone'))
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => h('div', {}, row.getValue('description'))
  },
  {
    accessorKey: 'confirmed',
    header: 'Confirmed',
    cell: ({ row }) => h('div', {}, row.getValue('confirmed') ? 'Yes' : 'No')
  },
  {
    accessorKey: 'confirmed_by',
    header: 'Confirmed By',
    cell: ({ row }) => h('div', {}, row.getValue('confirmed_by') || 'N/A')
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return h(
        'div',
        { class: 'relative' },
        h(RequestAction, {
          payment
        })
      )
    }
  }
]
