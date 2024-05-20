<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import dayjs from 'dayjs'
import { Mail, Phone } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useDark } from '@vueuse/core'

const isDark = useDark()

const dialogOpen = defineModel<boolean>()
const props = defineProps<{ args: any }>()
const emit = defineEmits(['dismiss', 'close'])

const eventCreated = ref(false)

const bookingSchema = z.object({
  startDate: z.string().nonempty(),
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
  mail: z.string().email(),
  phone: z.string().optional(),
  description: z.string().optional(),
  confirmed: z.boolean()
})

const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: {
    startDate: dayjs(props.args.startDate).format('YYYY-MM-DD'),
    startTime: dayjs(props.args.startTime).format('HH:mm'),
    endTime: dayjs(props.args.endTime).format('HH:mm'),
    mail: '',
    phone: '',
    description: '',
    confirmed: false
  }
})

const closeDialogDismiss = (state: boolean) => {
  if (!state && !eventCreated.value) {
    emit('dismiss')
  }
}

const createBooking = handleSubmit(() => {
  eventCreated.value = true
  dialogOpen.value = false
})
</script>

<template>
  <Dialog v-model:open="dialogOpen" :modal="true" @update:open="closeDialogDismiss">
    <DialogContent class="sm:max-w-[425px]" :trap-focus="true">
      <DialogHeader>
        <DialogTitle>Room Booking</DialogTitle>
        <DialogDescription> Please provide the details for your room booking. </DialogDescription>
      </DialogHeader>
      <form @submit="createBooking" class="grid gap-4 py-4">
        <FormField name="startDate">
          <FormItem class="grid grid-cols-4 items-center gap-4" :horizontal="true">
            <FormLabel for="date" class="text-right"> Start Date </FormLabel>
            <FormControl class="col-span-3">
              <Input type="date" id="date" v-model="values.startDate" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="startTime">
          <FormItem class="grid grid-cols-4 items-center gap-4" :horizontal="true">
            <FormLabel for="start-time" class="text-right"> Start Time </FormLabel>
            <FormControl class="col-span-3">
              <Input type="time" id="start-time" v-model="values.startTime" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="endTime">
          <FormItem class="grid grid-cols-4 items-center gap-4" :horizontal="true">
            <FormLabel for="end-time" class="text-right"> End Time </FormLabel>
            <FormControl class="col-span-3">
              <Input type="time" id="end-time" v-model="values.endTime" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="mail">
          <FormItem class="grid grid-cols-4 items-center gap-4" :horizontal="true">
            <FormLabel for="mail" class="text-right"> E-Mail </FormLabel>
            <FormControl class="col-span-3">
              <div class="relative" :class="{ dark: isDark }">
                <Input id="mail" v-model="values.mail" class="pl-10" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                  <Mail class="size-6 text-muted-foreground" />
                </span>
              </div>
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="phone">
          <FormItem class="grid grid-cols-4 items-center gap-4" :horizontal="true">
            <FormLabel for="phone" class="text-right"> Phone </FormLabel>
            <FormControl class="col-span-3">
              <div class="relative" :class="{ dark: isDark }">
                <Input id="phone" v-model="values.phone" class="pl-10" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                  <Phone class="size-6 text-muted-foreground" />
                </span>
              </div>
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="description">
          <FormItem class="grid grid-cols-4 items-center gap-4" :horizontal="true">
            <FormLabel for="description" class="text-right"> Description </FormLabel>
            <FormControl class="col-span-3">
              <Textarea id="description" v-model="values.description" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="confirmed">
          <FormItem class="grid grid-cols-4 items-center gap-4" :horizontal="true">
            <FormLabel for="confirmed" class="text-right"> Confirm Booking </FormLabel>
            <FormControl class="col-span-3">
              <Switch id="confirmed" v-model="values.confirmed" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit">Book Room</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped lang="scss">
input[type='time']::-webkit-calendar-picker-indicator,
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%);
  cursor: pointer;
}
.dark {
  input[type='time']::-webkit-calendar-picker-indicator,
  input[type='date']::-webkit-calendar-picker-indicator {
    filter: invert(94%) sepia(7%) saturate(750%) hue-rotate(185deg) brightness(105%) contrast(100%);
    cursor: pointer;
  }
}
</style>
