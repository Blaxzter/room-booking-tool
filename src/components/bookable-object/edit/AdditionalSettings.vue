<script lang="ts" setup>
import { computed, type PropType, ref, onBeforeMount } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import NameFade from '@/components/utils/NameFade.vue'
import { BookableObjectTermType } from '@/composables/useBookableObjectTerms'

import { Label } from '@/components/ui/label'
import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'

import type { BookableObject } from '@/types'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useGlobalSettings } from '@/stores/globalSettings'
const { isDemoUser } = storeToRefs(useGlobalSettings())
const { t }: { t: (key: string) => string } = useI18n()

interface InitialValues {
  splash_image_object: Blob
  emoji: string
  object_type: string
}

interface FormValues {
  object_type?: string
}

const objectTypes = [
  { id: 'room', name: t('bookableObject.edit.additionalSettings.objectTypes.room') },
  { id: 'object', name: t('bookableObject.edit.additionalSettings.objectTypes.object') },
  { id: 'equipment', name: t('bookableObject.edit.additionalSettings.objectTypes.equipment') }
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
const emits = defineEmits(['update'])

const avatarUpload = ref()

const formSchema = toTypedSchema(
  z.object({
    object_type: z.string().optional()
  })
)

const { values, validate, setValues } = useForm<FormValues>({
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

const updateBookableObjectImage = async (isDelete: boolean) => {
  if (props.bookableObject) {
    // delete old avatar
    if (isDelete) {
      const { deleteImage } = useBookableObjects()
      await deleteImage(props.bookableObject)
    }
    if (!isDelete) {
      emits('update', 'image', { id: await avatarUpload.value.uploadImage() })
    }
  }
}

const getValues = computed(() => values)
defineExpose({ getValues, validate, upload })
</script>

<template>
  <form class="grid gap-5 py-4">
    <div class="flex flex-col gap-3">
      <Label>{{ t('bookableObject.edit.additionalSettings.displayImage') }}</Label>
      <AvatarUploadComponent
        class="self-center"
        ref="avatarUpload"
        :is-square="true"
        :height="12"
        :initAvatar="bookableObject?.image?.id"
        @avatar-updated="updateBookableObjectImage(false)"
        @avatar-cleared="updateBookableObjectImage(true)"
        :add-clear-request="!!bookableObject"
        :disabled="isDemoUser"
      />
      <div class="text-sm text-muted-foreground">{{ t('bookableObject.edit.additionalSettings.uploadImageHelp') }}</div>
    </div>
    <FormField v-slot="{ componentField }" name="object_type">
      <FormItem>
        <FormLabel>
          {{ t('bookableObject.edit.additionalSettings.chooseType') }}
          <NameFade :termType="BookableObjectTermType.PLURAL" />
        </FormLabel>
        <Select
          v-bind="componentField"
          @update:modelValue="$emit('update', 'type', values.object_type)"
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="objectType in objectTypes"
                :key="objectType.id"
                :value="objectType.id"
              >
                {{ objectType.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormDescription>
          {{ t('bookableObject.edit.additionalSettings.chooseTypeDescription') }}
          <NameFade :termType="BookableObjectTermType.LOWERCASE" />.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <slot name="footer" />
  </form>
</template>

<style scoped></style>
