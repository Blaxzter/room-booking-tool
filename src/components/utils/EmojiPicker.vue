<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Emoji, EmojiIndex, Picker } from 'emoji-mart-vue-fast/src'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import RandomEmoji from '@/components/utils/EmojiComponent.vue'
import data from 'emoji-mart-vue-fast/data/all.json'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['select'])

const emojiIndex = new EmojiIndex(data, { exclude: ['flags'] })

const selectedEmoji = defineModel()

const selectEmoji = (emoji: Emoji) => {
  selectedEmoji.value = emoji.native
  emits('select', emoji.native)
}
</script>

<template>
  <div
    v-if="disabled"
    class="border border-gray-200 rounded-full cursor-not-allowed mt-1 w-[5rem] h-[5rem] flex items-center justify-center"
  >
    <emoji v-if="selectedEmoji" :data="emojiIndex" :emoji="selectedEmoji" :size="50" :native="true" />
    <RandomEmoji v-else :size="50" @select="selectEmoji" />
  </div>
  <DropdownMenu v-else>
    <DropdownMenuTrigger>
      <div
        class="border border-gray-200 rounded-full cursor-pointer mt-1 w-[5rem] h-[5rem] flex items-center justify-center hover:border-gray-500"
      >
        <emoji v-if="selectedEmoji" :data="emojiIndex" :emoji="selectedEmoji" :size="50" :native="true" />
        <RandomEmoji v-else :size="50" @select="selectEmoji" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <Picker :data="emojiIndex" set="twitter" @select="selectEmoji" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
