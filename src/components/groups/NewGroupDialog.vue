<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const emit = defineEmits(['close'])
// define open as v-model
const open = defineModel()

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
      <DialogDescription>
        Add a new group to manage rooms and other bookable objects.
      </DialogDescription>
    </DialogHeader>
    <div>
      <div class="space-y-4 py-2 pb-4">
        <div class="space-y-2">
          <Label for="name">Group name</Label>
          <Input
            id="name"
            :placeholder="
              groupNames[Math.floor(Math.random() * groupNames.length)]
            "
          />
        </div>
        <div class="space-y-2">
          <Label for="avatar">Avatar</Label>
          <input type="file" id="avatar" accept="image/*" />
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" @click="emit('close')"> Cancel </Button>
      <Button type="submit"> Continue </Button>
    </DialogFooter>
  </DialogContent>
</template>

<style scoped></style>
