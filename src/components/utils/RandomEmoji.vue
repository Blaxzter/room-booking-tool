<script setup lang="ts">
import { Emoji, EmojiIndex } from 'emoji-mart-vue-fast/src'
import data from 'emoji-mart-vue-fast/data/all.json'
import { computed } from 'vue'

const emojiIndex = new EmojiIndex(data)
const allEmojis = Object.keys(data.emojis)
const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)]

const emojiObject = computed(() => {
  return emojiIndex.findEmoji(randomEmoji)
})

const prop = defineProps({
  size: {
    type: Number,
    default: 64
  }
})

function emojiFallback(emoji) {
  return `:${emoji.short_names[0]}:`
}
</script>

<template>
  <emoji :data="emojiIndex" :emoji="emojiObject" :size="prop.size" :fallback="emojiFallback" :native="true" />
</template>

<style scoped></style>
