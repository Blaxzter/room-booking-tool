<script setup lang="ts">
import { PlusCircledIcon } from '@radix-icons/vue'

import NameFade from '@/components/utils/NameFade.vue'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import StepperComponent from '@/components/utils/StepperComponent.vue'
import DefaultSettings from '@/components/bookable-object/edit/DefaultSettings.vue'
import AccessSettings from '@/components/bookable-object/edit/AccessSettings.vue'
import AdditionalSettings from '@/components/bookable-object/edit/AdditionalSettings.vue'

import { bookableObjectRandomsSingular } from '@/assets/ts/constants'
import { useBookableObjects } from '@/stores/bookableObjects'

import { ref } from 'vue'

const activeStep = ref(0)
const steps = ['Basic Info', 'Permissions', 'Additional']

const defaultSettings = ref()
const accessSettings = ref()
const additionalSettings = ref()

const open = ref(false)

const stepRefMap: Record<number, any> = {
  0: defaultSettings,
  1: accessSettings,
  2: additionalSettings
}

const steptoValues: Record<number, any> = {
  0: {},
  1: {},
  2: {}
}

const createObject = async () => {
  await additionalSettings.value.upload().then((res: { id: string } | undefined) => {
    if (!res) return
    steptoValues[2] = { ...steptoValues[2], ...{ image: res } }
  })

  const createObject = {
    ...steptoValues[0],
    ...steptoValues[1],
    ...{ ...steptoValues[2], ...{ type: steptoValues[2].object_type } }
  }

  if (createObject.groupId === '-1') {
    createObject.group = []
  } else {
    createObject.group = [{ group_id: { id: createObject.groupId } }]
  }
  delete createObject.groupId

  const { createBookableObject } = useBookableObjects()
  await createBookableObject(createObject)
}

const nextStep = async () => {
  const valRes = await stepRefMap[activeStep.value].value.validate()
  if (valRes.valid) {
    steptoValues[activeStep.value] = valRes.values
    if (activeStep.value < steps.length - 1) activeStep.value++
    else {
      await createObject()
      open.value = false
    }
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger>
      <Button class="hidden sm:flex">
        <PlusCircledIcon class="mr-2 h-4 w-4" />
        Add new
      </Button>
      <Button class="fixed sm:hidden bottom-0 right-0 m-3 h-14 w-14 rounded-2xl z-10" variant="default">
        <PlusCircledIcon class="w-6 h-6" />
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
                <Button @click="nextStep" type="button"> Next</Button>
              </DialogFooter>
            </template>
          </DefaultSettings>
        </template>
        <template v-slot:step-1>
          <AccessSettings ref="accessSettings" :initial-values="steptoValues[1]">
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="activeStep--" type="button"> Back</Button>
                <Button @click="nextStep" type="button"> Next</Button>
              </DialogFooter>
            </template>
          </AccessSettings>
        </template>
        <template v-slot:step-2>
          <AdditionalSettings ref="additionalSettings" :initial-values="steptoValues[2]">
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="activeStep--" type="button"> Back</Button>
                <Button @click="nextStep" type="button">Create</Button>
              </DialogFooter>
            </template>
          </AdditionalSettings>
        </template>
      </StepperComponent>
    </DialogContent>
  </Dialog>
</template>
