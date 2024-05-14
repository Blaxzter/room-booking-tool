<script setup lang="ts">
import { ref } from 'vue'
import { uploadFiles } from '@directus/sdk'

import { UploadIcon, XIcon } from 'lucide-vue-next'
// @ts-ignore
import AvatarCropper from 'vue-avatar-cropper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useAuth } from '@/stores/auth'

const { client } = useAuth()

const showCropper = ref(false)
const avatar = ref<string>('')
const toBeUploadedImage = ref<Blob | null>(null)

const emits = defineEmits(['message'])

const uploadHandler = (copperJsInstance: any) => {
  copperJsInstance.getCroppedCanvas({ width: 512, height: 512 }).toBlob(
    async (blob: Blob | null) => {
      if (!blob) {
        return
      }
      // create local url from blob
      avatar.value = URL.createObjectURL(blob)
      toBeUploadedImage.value = blob
    },
    'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',
    0.9
  )
}

const clearImage = () => {
  avatar.value = ''
  toBeUploadedImage.value = null
}

// random number between 1 and 500
const random = Math.floor(Math.random() * 500) + 1

const uploadImage = async (): Promise<string | undefined> => {
  if (!toBeUploadedImage.value) {
    return undefined
  }

  const formData = new FormData()
  formData.append('folder', '9fd6c738-e603-4af0-9a7f-7512a44494f6')
  formData.append('file', toBeUploadedImage.value, 'group-image.png')

  const result = await client.request(uploadFiles(formData))
  return result.id
}

defineExpose({ uploadImage })
</script>

<template>
  <div class="rounded text-center relative">
    <div v-if="toBeUploadedImage" class="absolute end-[-5px] top-[-5px]">
      <XIcon class="w-4 h-4 cursor-pointer hover:opacity-75" @click="clearImage" />
    </div>
    <Avatar
      class="w-[5rem] h-[5rem] cursor-pointer hover:opacity-75"
      :class="`pastel-color-${random}`"
      @click="showCropper = true"
    >
      <AvatarImage :src="avatar" />
      <AvatarFallback>
        <UploadIcon class="w-8 h-8" />
      </AvatarFallback>
    </Avatar>

    <avatar-cropper
      :cropper-options="{
        aspectRatio: 1,
        autoCropArea: 1,
        movable: true,
        zoomable: true
      }"
      v-model="showCropper"
      :upload-handler="uploadHandler"
    />
  </div>
</template>

<style lang="scss">
@import '@/assets/css/colors.scss';

.vue-avatar-cropper-demo {
  max-width: 18em;
  margin: 0 auto;
}
.avatar {
  width: 160px;
  border-radius: 100%;
  display: block;
  margin: 20px auto;
}
.card-img-overlay {
  display: none;
  transition: all 0.5s;
}
.card-img-overlay button {
  margin-top: 20vh;
}
.card:hover .card-img-overlay {
  display: block;
}

.cropper-face {
  opacity: 1;
  background-color: transparent;
}

.cropper-face.cropper-move {
  cursor: move;
  border-radius: 50%;
  border: 1px rgba(255, 255, 255, 0.7) solid;
}

.cropper-face.cropper-move::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 100%;
  opacity: 0.1 !important;
}

.avatar-cropper-btn {
  background: hsl(var(--primary-foreground)) !important;
  &:hover {
    opacity: 0.8;
  }
}
</style>
