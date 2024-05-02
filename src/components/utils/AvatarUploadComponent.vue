<template>
  <div class="rounded text-center">
    <Avatar
      class="w-[5rem] h-[5rem] cursor-pointer hover:opacity-75"
      :class="`pastel-color-${random}`"
      @click="showCropper = true"
    >
      <AvatarImage v-if="avatar" :src="avatar" />
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
      upload-file-name="group-image"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { deleteFile, uploadFiles } from '@directus/sdk'

import { UploadIcon } from 'lucide-vue-next'
// noinspection TypeScriptCheckImport
import AvatarCropper from 'vue-avatar-cropper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useAuth } from '@/stores/auth'

const { client } = useAuth()

const showCropper = ref(false)
const selectedImageId = ref<string | null>(null)
const avatar = ref<string | undefined>(undefined)

const emits = defineEmits(['message'])

const uploadHandler = (copperJsInstance: any) => {
  console.log('uploadHandler', copperJsInstance)

  copperJsInstance.getCroppedCanvas({ width: 512, height: 512 }).toBlob(
    async (blob: Blob | null) => {
      if (!blob) {
        return
      }
      if (selectedImageId.value) {
        await client.request(deleteFile(selectedImageId.value))
      }

      const formData = new FormData()
      formData.append('folder', '9fd6c738-e603-4af0-9a7f-7512a44494f6')
      formData.append('file', blob, 'group-image.png')

      const result = await client.request(uploadFiles(formData))
      selectedImageId.value = result.id
      avatar.value = `http://localhost:8055/assets/${result.id}`
    },
    'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',
    0.9
  )
}

// random number between 1 and 500
const random = Math.floor(Math.random() * 500) + 1
</script>

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
