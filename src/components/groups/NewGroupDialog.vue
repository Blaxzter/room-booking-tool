<script setup lang="ts">
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import data from 'emoji-mart-vue-fast/data/all.json'
import { Emoji, Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'
import RandomEmoji from '@/components/utils/RandomEmoji.vue'
import { ref } from 'vue'

const emit = defineEmits(['close'])
// define open as v-model
const open = defineModel()

const emojiIndex = new EmojiIndex(data)
const selectedEmoji = ref<string | null>(null)

const showEmoji = (emoji) => {
  selectedEmoji.value = emoji.native
}

const groupNames: string[] = [
  'Power Rangers',
  'Die Fantastischen Vier',
  'Die Ärzte',
  'Scorpions',
  'Simpsons',
  'Die drei ???',
  'Backstreet Boys',
  "Destiny's Child",
  'Nirvana',
  'The Beatles',
  'ABBA',
  'Queen'
]
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create group</DialogTitle>
      <DialogDescription> Add a new group to manage rooms and other bookable objects. </DialogDescription>
    </DialogHeader>
    <div>
      <div class="space-y-4 py-2 pb-4">
        <div class="space-y-2">
          <Label for="name">Group Image</Label>
          <div class="flex items-center justify-center">
            <div class="mt-1 flex flex-col items-center">
              <AvatarUploadComponent />
              <div class="text-sm text-gray-500 mt-3">Upload an Image</div>
            </div>

            <div class="mx-5">or</div>

            <div class="flex flex-col items-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div class="border border-gray-200 rounded-full cursor-pointer mt-1">
                    <emoji v-if="selectedEmoji" :data="emojiIndex" :emoji="selectedEmoji" :size="50" :native="true" />
                    <RandomEmoji v-else :size="50" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Picker :data="emojiIndex" set="twitter" @select="showEmoji" />
                </DropdownMenuContent>
              </DropdownMenu>
              <div class="text-sm text-gray-500 mt-2">Select an Emoji</div>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="name">Group name</Label>
          <Input id="name" :placeholder="groupNames[Math.floor(Math.random() * groupNames.length)]" />
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" @click="emit('close')"> Cancel </Button>
      <Button type="submit"> Continue </Button>
    </DialogFooter>
  </DialogContent>
</template>

<style>
@import 'emoji-mart-vue-fast/css/emoji-mart.css';
</style>
