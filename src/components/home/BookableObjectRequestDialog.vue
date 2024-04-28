<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import NameFade from '@/components/utils/NameFade.vue'

import { Label } from '@/components/ui/label'
import { ref } from 'vue'
import { BookableObjectImpl, type BookableObject } from '@/types'
import { PlusCircledIcon } from '@radix-icons/vue'
import { bookableObjectRandoms } from '@/assets/ts/constants'

const bookableObject = ref<BookableObject>(BookableObjectImpl)

const createBookableObject = () => {
  console.log('Creating bookableObject', bookableObject.value)
}
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button>
        <PlusCircledIcon class="mr-2 h-4 w-4" />
        Add new
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]" :trap-focus="true">
      <DialogHeader>
        <DialogTitle class="fade-transition">
          Create
          <NameFade :messages="bookableObjectRandoms" />
        </DialogTitle>
        <DialogDescription>
          Please find the details of your bookableObject.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input
            type="text"
            id="name"
            v-model="bookableObject.name"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right"> Description </Label>
          <Textarea
            type="text"
            id="description"
            v-model="bookableObject.description"
            class="col-span-3"
            readonly
          />
        </div>
      </div>
      <DialogFooter>
        <Button @click="createBookableObject" class="min-w-[120px]">
          <span>Create <NameFade :messages="bookableObjectRandoms" /></span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
