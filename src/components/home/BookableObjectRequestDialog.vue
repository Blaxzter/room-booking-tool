<script setup lang="ts">
import { ChevronRightIcon, PlusCircledIcon } from '@radix-icons/vue'

import NameFade from '@/components/utils/NameFade.vue'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { bookableObjectRandoms } from '@/assets/ts/constants'
import DefaultSettings from '@/components/bookable-object/edit/DefaultSettings.vue'
import StepperComponent from '@/components/utils/StepperComponent.vue'

import { ref } from 'vue'

const activeStep = ref(0)
const steps = ['Basic Info', 'Permissions', 'Additional']
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button>
        <PlusCircledIcon class="mr-2 h-4 w-4" />
        Add new
      </Button>
    </DialogTrigger>
    <DialogContent :trap-focus="true">
      <StepperComponent v-model="activeStep" :steps="steps">
        <template v-slot:step-0>
          <DialogHeader>
            <DialogTitle class="fade-transition">
              Create
              <NameFade :messages="bookableObjectRandoms" />
            </DialogTitle>
            <DialogDescription> Please fill in the details of your bookableObject. </DialogDescription>
          </DialogHeader>
          <DefaultSettings>
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="activeStep++"> Next </Button>
              </DialogFooter>
            </template>
          </DefaultSettings>
        </template>
        <template v-slot:step-1>
          <DialogHeader>
            <DialogTitle class="fade-transition">
              Create
              <NameFade :messages="bookableObjectRandoms" />
            </DialogTitle>
            <DialogDescription> Please fill in the details of your bookableObject. </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button @click="activeStep--"> Back </Button>
            <Button @click="activeStep++"> Next </Button>
          </DialogFooter>
        </template>
      </StepperComponent>
    </DialogContent>
  </Dialog>
</template>
