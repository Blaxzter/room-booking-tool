<script lang="ts" setup>
import { computed, ref, type PropType, onBeforeMount } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useI18n } from 'vue-i18n'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CopyIcon } from '@radix-icons/vue'

import NameFade from '@/components/utils/NameFade.vue'
import { BookableObjectTermType } from '@/composables/useBookableObjectTerms'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { BookableObject } from '@/types'

interface InitialValues {
  is_internal: boolean
  confirm_booking_required: boolean
  information_shared: boolean
  confirm_role: string
}

const props = defineProps({
  initialValues: {
    type: Object as PropType<InitialValues>,
    required: false
  },
  bookableObject: {
    type: Object as PropType<BookableObject>,
    required: false
  }
})

defineEmits(['update'])

const formSchema = toTypedSchema(
  z.object({
    is_internal: z.boolean(),
    uniqueId: z.string().optional(),
    confirm_booking_required: z.boolean(),
    information_shared: z.boolean(),
    confirm_role: z.string().optional()
  })
)

const { t } = useI18n()

const roles = [
  { id: 'admin', name: t('bookableObject.edit.accessSettings.roles.admin') },
  { id: 'member', name: t('bookableObject.edit.accessSettings.roles.member') }
]

// Copy link stuff

const visibleMessage = ref('')

const currentHost = computed(() => {
  return window.location.protocol + '//' + window.location.host
})

const randomString = Math.random().toString(36).substring(2, 10)

const copyLink = () => {
  navigator.clipboard.writeText(`${window.location.host}/${visibleMessage.value}/${randomString}`)
}

interface FormValues {
  is_internal: boolean
  uniqueId?: string
  confirm_booking_required: boolean
  information_shared: boolean
  confirm_role?: string
}

const { values, validate, setValues } = useForm<FormValues>({
  validationSchema: formSchema
})

onBeforeMount(() => {
  if (props.initialValues) {
    setValues({
      is_internal: props.initialValues.is_internal || false,
      uniqueId: randomString,
      confirm_booking_required: props.initialValues.confirm_booking_required || false,
      information_shared: props.initialValues.information_shared || true,
      confirm_role: props.initialValues.confirm_role || 'member'
    })
  } else if (props.bookableObject) {
    setValues({
      is_internal: props.bookableObject.is_internal,
      uniqueId: props.bookableObject.uniqueId,
      confirm_booking_required: props.bookableObject.confirm_booking_required,
      information_shared: props.bookableObject.information_shared,
      confirm_role: props.bookableObject.confirm_role || 'member'
    })
  }
})

const getValues = computed(() => values)
defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-5 py-4">
    <div class="text-lg font-semibold mb-2">{{ t('bookableObject.edit.accessSettings.title') }}</div>
    <FormField v-slot="{ value, handleChange }" name="is_internal">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" @click="$emit('update', 'is_internal', !value)" />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>{{ t('bookableObject.edit.accessSettings.publicVisible.label') }}</FormLabel>
          <FormDescription>{{ t('bookableObject.edit.accessSettings.publicVisible.description') }}</FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <Collapsible v-model:open="values.is_internal">
      <CollapsibleContent>
        <div>{{ t('bookableObject.edit.accessSettings.link.title') }}</div>
        <div class="flex items-center justify-between gap-x-2 border rounded px-3 py-0.5 max-w-full">
          <span class="text-xs text-gray-500 truncate overflow-ellipsis"
            >{{ currentHost }}/<NameFade
              :termType="BookableObjectTermType.LOWERCASE"
              @value-changed="visibleMessage = $event"
            />/{{ values.uniqueId }}</span
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
          <Checkbox
            :checked="value"
            @update:checked="handleChange"
            @click="$emit('update', 'confirm_booking_required', !value)"
          />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>{{ t('bookableObject.edit.accessSettings.confirmBooking.label') }}</FormLabel>
          <FormDescription>
            {{ t('bookableObject.edit.accessSettings.confirmBooking.description') }}
          </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <Collapsible v-model:open="values.confirm_booking_required">
      <CollapsibleContent>
        <FormField v-slot="{ componentField }" name="confirm_role">
          <FormItem>
            <FormLabel>{{ t('bookableObject.edit.accessSettings.confirmRole.label') }}</FormLabel>
            <Select v-bind="componentField" @update:modelValue="$emit('update', 'confirm_role', values.confirm_role)">
              <FormControl>
                <SelectTrigger>
                  <SelectValue :placeholder="t('bookableObject.edit.accessSettings.confirmRole.placeholder')" />
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
            <FormDescription>{{ t('bookableObject.edit.accessSettings.confirmRole.description') }}</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </CollapsibleContent>
    </Collapsible>

    <FormField v-slot="{ value, handleChange }" name="information_shared">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox
            :checked="value"
            @update:checked="handleChange"
            @click="$emit('update', 'information_shared', !value)"
          />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>{{ t('bookableObject.edit.accessSettings.informationShared.label') }}</FormLabel>
          <FormDescription>{{ t('bookableObject.edit.accessSettings.informationShared.description') }}</FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <slot name="footer"></slot>
  </form>
</template>

<style scoped></style>
