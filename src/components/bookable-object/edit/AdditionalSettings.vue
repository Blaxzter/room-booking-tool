<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
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

const { emoji, object_type } = props.initialValues

const avatarUpload = ref()

const formSchema = toTypedSchema(
  z.object({
    object_type: z.string().optional()
  })
)

const { values, validate } = useForm({
  validationSchema: formSchema,
  initialValues: {
    object_type: object_type || 'room'
  }
})

const upload = async () => {
  return { id: await avatarUpload.value.uploadImage() } as { id: string }
}

const getValues = computed(() => values)
defineExpose({ getValues, validate, upload })
</script>

<template>
  <form class="grid gap-5 py-4">
    <div class="grid gap-2">
      <Label>Display Image</Label>
      <AvatarUploadComponent ref="avatarUpload" :is-square="true" :height="8" />
      <div class="text-sm text-muted-foreground">Upload an splash image.</div>
    </div>
    <FormField v-slot="{ componentField }" name="object_type">
      <FormItem>
        <FormLabel>Choose <NameFade :messages="bookableObjectRandoms" /></FormLabel>
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

    <slot name="footer">
      <Button type="submit" class="min-w-[120px]">
        <span>Update <NameFade :messages="bookableObjectRandoms" /></span>
      </Button>
    </slot>
  </form>
</template>

<style scoped></style>
