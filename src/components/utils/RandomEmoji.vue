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

function emojiFallback(emoji) {
  return `:${emoji.short_names[0]}:`
}

const santaEmojiObject = computed(() => {
  return emojiIndex.findEmoji(':santa:')
})
</script>

<template>
  <emoji :data="emojiIndex" :emoji="emojiObject" :size="64" :fallback="emojiFallback" :native="true" />
</template>

<style scoped></style>
