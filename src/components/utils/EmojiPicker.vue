<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import RandomEmoji from '@/components/utils/Emoji.vue'

// @ts-ignore
import { Emoji, Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
import data from 'emoji-mart-vue-fast/data/all.json'
const emojiIndex = new EmojiIndex(data, { exclude: ['flags'] })

const selectedEmoji = defineModel()

const selectEmoji = (emoji: Emoji) => {
  selectedEmoji.value = emoji.native
}
</script>

<template>
  <DropdownMenu>
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
