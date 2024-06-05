import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { BookableObject, Booking } from '@/types'
import RequestAction from '@/components/requests-components/RequestAction.vue'
import { ArrowUpDown, PhoneIcon, MailIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'bookable_object_id',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['Bookable Object', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'ms-4' }, (row.getValue('bookable_object_id') as BookableObject)?.name)
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) =>
      h('div', {}, [
        h('div', {}, new Date(row.getValue('end_date')).toLocaleDateString()),
        h('div', {}, new Date(row.getValue('end_date')).toLocaleTimeString())
      ])
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) =>
      h('div', {}, [
        h('div', {}, new Date(row.getValue('end_date')).toLocaleDateString()),
        h('div', {}, new Date(row.getValue('end_date')).toLocaleTimeString())
      ])
  },
  {
    accessorKey: 'is_full_day',
    header: 'Full Day',
    cell: ({ row }) => h('div', {}, row.getValue('is_full_day') ? 'Yes' : 'No')
  },
  // make a custom column for display_name, mail, phone as a single column
  {
    accessorKey: 'display_name',
    header: 'Contact Information',
    cell: ({ row }) => {
      const booking = row.original
      return h('div', { class: 'flex flex-col gap-1' }, [
        h('div', {}, booking.display_name || 'N/A'),
        h('div', { class: 'flex align-center' }, [h(MailIcon, { height: 20, class: 'me-1' }), booking.mail || 'N/A']),
        h('div', { class: 'flex align-center' }, [h(PhoneIcon, { height: 20, class: 'me-1' }), booking.phone || 'N/A'])
      ])
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => h('div', { class: 'min-w-[200px]' }, row.getValue('description'))
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original

      return h(
        'div',
        { class: 'relative' },
        h(RequestAction, {
          booking
        })
      )
    }
  }
]
