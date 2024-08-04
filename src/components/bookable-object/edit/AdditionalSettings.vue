<script setup lang="ts">
import { computed, type PropType, ref, onBeforeMount } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import NameFade from '@/components/utils/NameFade.vue'
import { bookableObjectRandoms, bookableObjectRandomsLower } from '@/assets/ts/constants'
import { Label } from '@/components/ui/label'
import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'

import type { BookableObject } from '@/types'

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
    required: false
  },
  bookableObject: {
    type: Object as PropType<BookableObject>,
    required: false
  }
})
const emit = defineEmits(['update'])

const avatarUpload = ref()

const formSchema = toTypedSchema(
  z.object({
    object_type: z.string().optional()
  })
)

const { values, validate, setValues } = useForm({
  validationSchema: formSchema
})

const upload = async () => {
  const uploaded_image_id = await avatarUpload.value.uploadImage()
  if (!uploaded_image_id) {
    return undefined
  }
  return { id: uploaded_image_id } as { id: string }
}

onBeforeMount(() => {
  if (props.initialValues) {
    setValues({
      object_type: props.initialValues.object_type || 'room'
    })
  } else if (props.bookableObject) {
    setValues({
      object_type: props.bookableObject.type || 'room'
    })
  }
})

const getValues = computed(() => values)
defineExpose({ getValues, validate, upload })
</script>

<template>
  <form class="grid gap-5 py-4">
    <div class="flex flex-col gap-3">
      <Label>Display Image</Label>
      <AvatarUploadComponent class="self-center" ref="avatarUpload" :is-square="true" :height="12" />
      <div class="text-sm text-muted-foreground">Upload an splash image.</div>
    </div>
    <FormField v-slot="{ componentField }" name="object_type">
      <FormItem>
        <FormLabel>Choose type of <NameFade :messages="bookableObjectRandoms" /></FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="objectType in objectTypes" :key="objectType.id" :value="objectType.id">
                {{ objectType.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormDescription> Choose the type of <NameFade :messages="bookableObjectRandomsLower" />. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <slot name="footer" />
  </form>
</template>

<style scoped></style>
