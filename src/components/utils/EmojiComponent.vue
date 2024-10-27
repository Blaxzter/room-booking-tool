<script setup lang="ts">
import { Emoji, EmojiIndex } from 'emoji-mart-vue-fast/src'
import data from 'emoji-mart-vue-fast/data/all.json'
import _ from 'lodash'
import { computed } from 'vue'

const includeCategories = ['smileys', 'people', 'nature', 'foods', 'activity', 'places', 'objects']

const emojiIndex = new EmojiIndex(data)
const allEmojis = _.flatten(
  includeCategories.map((category) => _.find(emojiIndex.categories(), { id: category })?.emojis)
)

const prop = defineProps({
  size: {
    type: Number,
    default: 64
  },
  emoji: {
    type: String,
    default: null,
    required: false
  }
})

const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)]

const visibleEmojis = computed(() => {
  if (prop.emoji) {
    const result = emojiIndex.search(prop.emoji)
    if (result.length === 0) {
      return randomEmoji
    }
    return result
  } else {
    return randomEmoji
  }
})

const emit = defineEmits(['select'])

emit('select', randomEmoji)

function emojiFallback(emoji: Emoji) {
  return `:${emoji.short_names[0]}:`
}
</script>

<template>
  <emoji :data="emojiIndex" :emoji="visibleEmojis" :size="prop.size" :fallback="emojiFallback" :native="true" />
</template>

<style scoped></style>
