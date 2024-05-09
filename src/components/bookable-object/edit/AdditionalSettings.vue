<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CopyIcon } from '@radix-icons/vue'

import NameFade from '@/components/utils/NameFade.vue'
import { bookableObjectRandoms, bookableObjectRandomsLower } from '@/assets/ts/constants'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface InitialValues {
  splash_image_object: Blob
  emoji: string
  object_type: string
}

const objectTypes = [
  { id: 'room', name: 'Room' },
  { id: 'object', name: 'Object' },
  { id: 'equipment', name: 'Equipment' }
]

const props = defineProps({
  initialValues: {
    type: Object as PropType<InitialValues>,
    required: true
  }
})

const { splash_image_object, emoji, object_type } = props.initialValues

const formSchema = toTypedSchema(
  z.object({
    splash_image_object: z.any(),
    emoji: z.string().optional(),
    object_type: z.string().optional()
  })
)

const { values, validate } = useForm({
  validationSchema: formSchema,
  initialValues: {
    splash_image_object: splash_image_object || '',
    emoji: emoji,
    object_type: object_type
  }
})

const getValues = computed(() => values)
defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-5 py-4">
    <FormField v-slot="{ value, handleChange }" name="public_visible">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>Public Visible</FormLabel>
          <FormDescription> Toggle to make the bookable object publicly visible. </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <Collapsible v-model:open="values.public_visible">
      <CollapsibleContent>
        <div>Link</div>
        <div class="flex items-center justify-between gap-x-2 border rounded px-3 py-0.5">
          <span class="text-sm text-gray-500"
            >{{ currentHost }}/<NameFade
              :messages="bookableObjectRandomsLower"
              @value-changed="visibleMessage = $event"
            />/{{ randomString }}</span
          >
          <CollapsibleTrigger>
            <Button size="sm" variant="ghost" @click="copyLink" type="button">
              <CopyIcon class="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <FormField v-slot="{ value, handleChange }" name="confirm_booking_required">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>Confirm Booking Required</FormLabel>
          <FormDescription> Toggle to require confirmation for booking. </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="confirm_role">
      <FormItem>
        <FormLabel>Confirm Role</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormDescription> Select the role a group member needs to confirm a booking. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <slot name="footer">
      <Button type="submit" class="min-w-[120px]">
        <span>Update <NameFade :messages="bookableObjectRandoms" /></span>
      </Button>
    </slot>
  </form>
</template>

<style scoped></style>
