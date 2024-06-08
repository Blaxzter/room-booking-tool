<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { uploadFiles } from '@directus/sdk'

import { UploadIcon, XIcon } from 'lucide-vue-next'
// @ts-ignore
import AvatarCropper from 'vue-avatar-cropper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useUser } from '@/stores/user'

const { client } = useUser()

const showCropper = ref(false)
const avatar = ref<string>('')
const toBeUploadedImage = ref<Blob | null>(null)

const emits = defineEmits(['avatar-updated'])
const props = defineProps({
  isSquare: {
    type: Boolean,
    default: false
  },
  initAvatar: {
    type: String,
    default: '',
    required: false
  },
  height: {
    type: Number,
    default: 5
  },
  imageHeight: {
    type: Number,
    default: 512
  },
  alignment: {
    type: String,
    default: 'center'
  },
  folder: {
    type: String,
    default: '76196db0-2d35-4646-ac32-8df8a9986615'
  }
})

const selectImage = (copperJsInstance: any) => {
  copperJsInstance
    .getCroppedCanvas({
      width: props.isSquare ? props.imageHeight * 0.75 : props.imageHeight,
      height: props.imageHeight
    })
    .toBlob(
      async (blob: Blob | null) => {
        if (!blob) {
          return
        }
        // create local url from blob
        avatar.value = URL.createObjectURL(blob)
        toBeUploadedImage.value = blob
        emits('avatar-updated', true)
      },
      'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',
      0.9
    )
}

const clearImage = () => {
  avatar.value = ''
  toBeUploadedImage.value = null
  emits('avatar-updated', true)
}

// random number between 1 and 500
const random = Math.floor(Math.random() * 500) + 1

const uploadImage = async (): Promise<string | undefined> => {
  if (!toBeUploadedImage.value) {
    return undefined
  }

  const formData = new FormData()
  formData.append('folder', props.folder)
  formData.append('file', toBeUploadedImage.value, 'object-image.png')

  const result = await client.request(uploadFiles(formData))
  return result.id
}

const avatarCssVars = computed(() => {
  return {
    '--avatar-roundness': props.isSquare ? '0' : '50%'
  }
})

// on mouted set the avatar
onMounted(() => {
  avatar.value = `${backendUrl}/assets/${props.initAvatar}`
})

defineExpose({ uploadImage })

const backendUrl = inject('backendUrl')
</script>

<template>
  <div
    class="relative rounded"
    :class="`text-${props.alignment}`"
    :style="{
      width: `calc(${props.height * (isSquare ? 0.75 : 1)}rem + 25px)`
    }"
  >
    <div v-if="toBeUploadedImage || avatar" class="absolute end-[-5px] top-[-5px]">
      <XIcon class="w-4 h-4 cursor-pointer hover:opacity-75" @click="clearImage" />
    </div>
    <Avatar
      class="cursor-pointer hover:opacity-75"
      :class="`pastel-color-${random}`"
      :style="{
        width: `${props.height * (isSquare ? 0.75 : 1)}rem`,
        height: `${props.height}rem`
      }"
      :shape="isSquare ? 'square' : 'circle'"
      @click="showCropper = true"
    >
      <AvatarImage :src="avatar" />
      <AvatarFallback>
        <UploadIcon class="w-8 h-8" />
      </AvatarFallback>
    </Avatar>

    <avatar-cropper
      :style="avatarCssVars"
      :cropper-options="{
        aspectRatio: isSquare ? 0.75 : 1,
        autoCropArea: 1,
        movable: true,
        zoomable: true
      }"
      v-model="showCropper"
      :upload-handler="selectImage"
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
  border-radius: var(--avatar-roundness);
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
  border-radius: var(--avatar-roundness);
  border: 1px rgba(255, 255, 255, 0.7) solid;
}

.cropper-face.cropper-move::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: var(--avatar-roundness);
  opacity: 0.1 !important;
}

.avatar-cropper-btn {
  background: hsl(var(--primary-foreground)) !important;
  &:hover {
    opacity: 0.8;
  }
}
</style>
