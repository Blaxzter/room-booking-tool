<script setup lang="ts">
import { ChevronRightIcon, PlusCircledIcon } from '@radix-icons/vue'

import NameFade from '@/components/utils/NameFade.vue'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import StepperComponent from '@/components/utils/StepperComponent.vue'
import DefaultSettings from '@/components/bookable-object/edit/DefaultSettings.vue'
import AccessSettings from '@/components/bookable-object/edit/AccessSettings.vue'

import { bookableObjectRandomsSingular } from '@/assets/ts/constants'

import { ref } from 'vue'

const activeStep = ref(0)
const steps = ['Basic Info', 'Permissions', 'Additional']

const defaultSettings = ref({})
const accessSettings = ref({})

const stepRefMap: Record<number, any> = {
  0: defaultSettings,
  1: accessSettings
}

const steptoValues: Record<number, any> = {
  0: {},
  1: {},
  2: {}
}

const nextStep = async () => {
  const valRes = await stepRefMap[activeStep.value].value.validate()
  if (valRes.valid) {
    steptoValues[activeStep.value] = valRes.values
    activeStep.value++
  }
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
    <DialogContent :trap-focus="true">
      <DialogHeader class="mb-2">
        <DialogTitle class="fade-transition">
          Create a new
          <NameFade :messages="bookableObjectRandomsSingular" />
        </DialogTitle>
      </DialogHeader>
      <StepperComponent v-model="activeStep" :steps="steps">
        <template v-slot:step-0>
          <DefaultSettings ref="defaultSettings" :initial-values="steptoValues[0]">
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="nextStep" type="button"> Next </Button>
              </DialogFooter>
            </template>
          </DefaultSettings>
        </template>
        <template v-slot:step-1>
          <AccessSettings ref="accessSettings" :initial-values="steptoValues[1]">
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="activeStep--" type="button"> Back </Button>
                <Button @click="nextStep" type="button"> Next </Button>
              </DialogFooter>
            </template>
          </AccessSettings>
        </template>
      </StepperComponent>
    </DialogContent>
  </Dialog>
</template>
