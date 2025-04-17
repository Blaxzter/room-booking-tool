import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { ArrowUpDown, PhoneIcon, MailIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import RequestAction from '@/components/requests-components/RequestAction.vue'
import { Button } from '@/components/ui/button'

import type { BookableObject, Booking } from '@/types'

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'bookable_object_id',
    header: ({ column }) => {
      const { t } = useI18n()
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => [t('requestsComponents.column.bookableObject'), h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'ms-4' }, (row.getValue('bookable_object_id') as BookableObject)?.name)
  },
  {
    accessorKey: 'start_date',
    header: () => {
      const { t } = useI18n()
      return h('div', {}, t('requestsComponents.column.startDate'))
    },
    cell: ({ row }) =>
      h('div', {}, [
        h('div', {}, new Date(row.getValue('start_date')).toLocaleDateString()),
        h('div', {}, new Date(row.getValue('start_date')).toLocaleTimeString())
      ])
  },
  {
    accessorKey: 'end_date',
    header: () => {
      const { t } = useI18n()
      return h('div', {}, t('requestsComponents.column.duration'))
    },
    cell: ({ row }) => {
      const { t } = useI18n()
      const booking = row.original
      const duration = new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()
      if (booking.is_full_day) {
        return h('div', {}, t('requestsComponents.column.fullDay'))
      }
      // check if start and end date is on the same day
      if (new Date(booking.start_date).getDate() === new Date(booking.end_date).getDate()) {
        // display the duration in hours and minutes
        const hours = Math.floor(duration / 1000 / 60 / 60)
        const minutes = Math.floor((duration / 1000 / 60) % 60)
        return h('div', {}, `${hours}h ${minutes}m`)
      }

      return h('div', {}, [
        h('div', {}, new Date(row.getValue('end_date')).toLocaleDateString()),
        h('div', {}, new Date(row.getValue('end_date')).toLocaleTimeString())
      ])
    }
  },
  // make a custom column for display_name, mail, phone as a single column
  {
    accessorKey: 'display_name',
    header: () => {
      const { t } = useI18n()
      return h('div', {}, t('requestsComponents.column.contactInformation'))
    },
    cell: ({ row }) => {
      const { t } = useI18n()
      const booking = row.original
      return h('div', { class: 'flex flex-col gap-1' }, [
        h('div', {}, booking.display_name || t('requestsComponents.column.notAvailable')),
        h('div', { class: 'flex align-center' }, [
          h(MailIcon, { height: 20, class: 'me-1' }), 
          booking.mail || t('requestsComponents.column.notAvailable')
        ]),
        h('div', { class: 'flex align-center' }, [
          h(PhoneIcon, { height: 20, class: 'me-1' }), 
          booking.phone || t('requestsComponents.column.notAvailable')
        ])
      ])
    }
  },
  {
    accessorKey: 'description',
    header: () => {
      const { t } = useI18n()
      return h('div', {}, t('requestsComponents.column.description'))
    },
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
