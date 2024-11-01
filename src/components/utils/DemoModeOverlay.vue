<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { storeToRefs } from 'pinia'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox  } from '@/components/ui/checkbox'

import { useGlobalSettings } from '@/stores/globalSettings'

const { isDemoUser, demoDialogOpen } = storeToRefs(useGlobalSettings())

const dontShowAgain = ref(false)

// Prop that shows the Dialog Trigger
const props = defineProps({
  startOpen: {
    type: Boolean,
    default: true,
  },
  identifier: {
    type: String,
    default: '1',
  },
})

const dontShowAgainChange = () => {
  dontShowAgain.value = !dontShowAgain.value
  console.log('storeDontShowAgain, dontShowAgain.value:', dontShowAgain.value)
  localStorage.setItem('dontShowAgainDemoMode', dontShowAgain.value.toString())
}

// On mounted
onBeforeMount(async () => {
  console.log('isDemoUser.value:', isDemoUser.value)
  // check local storage for the dontShowAgain value
  const dontShowAgainValue = localStorage.getItem('dontShowAgainDemoMode')
  dontShowAgain.value = dontShowAgainValue === 'true'

  // Set the dialog's visibility state to the prop value
  demoDialogOpen.value = props.startOpen && isDemoUser.value
  if (props.startOpen && isDemoUser.value && dontShowAgain.value) {
    demoDialogOpen.value = false
    console.log('demoDialogOpen.value:', demoDialogOpen.value)
  }
})
</script>

<template>
  <Dialog v-model:open="demoDialogOpen" v-if="isDemoUser" >
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader class="flex justify-between items-center">
        <div>
          <DialogTitle>Demo Mode Active</DialogTitle>
          <DialogDescription>
            You are currently in demo mode, which provides limited access to features. To unlock full functionality, please request full membership.
          </DialogDescription>
        </div>
      </DialogHeader>
      <div class="items-center">
        <Label for="message">
          Message
        </Label>
        <Textarea id="message" placeholder="Describe your request..." class="col-span-3" />
      </div>
      <div class="flex items-center space-x-2">
        <Label for="demo-checkbox" class="flex items-center space-x-1">
          <Checkbox
            id="demo-checkbox"
            type="checkbox"
            :checked="dontShowAgain"
            @update:checked="dontShowAgainChange"
          />
          <span>Don't show again</span>
        </Label>
      </div>

      <DialogFooter class="flex justify-between">

        <Button type="submit">
          Send Member Request
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
