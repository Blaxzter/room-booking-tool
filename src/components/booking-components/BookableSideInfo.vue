<script setup lang="ts">
import { computed, type PropType, ref, onMounted, inject } from 'vue'
import { PlusCircledIcon, CopyIcon } from '@radix-icons/vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { EllipsisVertical, EditIcon } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useGroups } from '@/stores/groups'

import { Button } from '@/components/ui/button'

import type { BookableObject } from '@/types'
import BookingCardSplashImage from '@/components/home/BookingCardSplashImage.vue'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import BookingRequestWrapper from '@/components/booking-components/booking-request-dialog/BookingRequestWrapper.vue'
import processImage from '@/assets/ts/image-utils'
import { useToast } from '@/components/ui/toast'

const { t } = useI18n()
const { toast } = useToast()

const props = defineProps({
  bookableObject: { type: Object as PropType<BookableObject>, default: undefined },
  topNav: {
    type: Boolean,
    default: false
  }
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const imageLarge = breakpoints.smallerOrEqual('lg')
const imageSmall = breakpoints.smallerOrEqual('md')

const imageHeight = computed(() => {
  if (props.topNav) return 40
  if (imageSmall.value) return 50
  if (imageLarge.value) return 75
  return undefined
})

const openEventDialog = ref(false)

const isPublicView = computed(() => {
  const route = useRoute()
  return route.meta.publicView
})

const copySharingLink = () => {
  if (props.bookableObject) {
    const url = `${window.location.origin}/${props.bookableObject.type}/${props.bookableObject.uniqueId}`
    navigator.clipboard.writeText(url)

    toast({
      title: t('bookingComponents.bookableSideInfo.copyShareLinkSuccess'),
      variant: 'success',
      description: url
    })
  }
}

defineEmits(['createBookableObject'])

// TODO create a composable from this fuction
const backendUrl = inject('backendUrl')
const idToColor = ref(new Map<string, string>())
const imageLoading = ref(false)
const getImageColor = async (image_id: string) => {
  imageLoading.value = true
  return await processImage(`${backendUrl}/assets/${image_id}`).then((color) => {
    idToColor.value.set(image_id, color)
    imageLoading.value = false
    return color
  })
}

const roleValue = computed(() => {
  const { getUserRoleByBookableObject } = useGroups()
  return getUserRoleByBookableObject(props.bookableObject)
})

onMounted(() => {
  console.log(props.bookableObject?.image)
  if (props.bookableObject?.image) {
    getImageColor(props.bookableObject?.image.id)
  }
})
</script>

<template>
  <div
    class="flex-row lg:flex-col lg:space-y-4"
    :class="[!topNav ? 'hidden rounded-lg border bg-card' : '']"
    v-if="bookableObject"
  >
    <div class="flex flex-row p-2 lg:p-4 lg:flex-col lg:space-y-4">
      <BookingCardSplashImage
        v-if="bookableObject.image"
        :alt_name="bookableObject.name"
        :image_id="bookableObject.image.id"
        :rounded="true"
        :height="imageHeight"
        :loading="imageLoading"
        class="me-2 lg:me-0"
        :style="`background-color:` + (idToColor.get(bookableObject.image.id) ?? 'white')"
      />
      <div class="overflow-hidden">
        <div class="sm:text-2xl text-sm" :class="{ 'text-nowrap text-l': topNav }">{{ bookableObject?.name }}</div>
        <div
          class="text-sm text-muted-foreground"
          :class="{
            'text-nowrap line-clamp-1': topNav
          }"
        >
          {{ bookableObject?.description }}
        </div>
      </div>
    </div>
    <div
      class="flex flex-row justify-end items-center flex-grow lg:items-start lg:flex-col lg:justify-stretch p-2 md:p-4 lg:p-6"
    >
      <div class="lg:flex-grow"></div>
      <div class="flex gap-2 flex-row justify-between w-full">
        <Button @click="openEventDialog = true" :size="topNav ? 'icon' : 'default'">
          <PlusCircledIcon class="h-6 w-6 sm:h-4 sm:w-4" />
          <span class="hidden sm:inline ms-2">{{ t('bookingComponents.bookableSideInfo.createBooking') }}</span>
        </Button>
        <template v-if="!isPublicView">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem class="cursor-pointer" @click.stop="copySharingLink">
                  <CopyIcon class="mr-2 h-4 w-4" />
                  <span>{{ t('bookingComponents.bookableSideInfo.copyShareLink') }}</span>
                </DropdownMenuItem>
                <DropdownMenuItem v-if="roleValue >= 3" class="cursor-pointer" @click.stop="$router.push({ name: 'bookable-object-edit', params: { id: bookableObject.id } })">
                  <EditIcon class="mr-2 h-4 w-4" />
                  <span>{{ t('bookableObject.menuButton.edit') }}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
      </div>
      <booking-request-wrapper v-model="openEventDialog" />
    </div>
  </div>
</template>

<style scoped></style>
