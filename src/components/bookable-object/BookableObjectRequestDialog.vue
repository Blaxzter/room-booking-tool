<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, PlusCircledIcon, RocketIcon } from '@radix-icons/vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'

import { Button } from '@/components/ui/button'
import NameFade from '@/components/utils/NameFade.vue'
import StepperComponent from '@/components/utils/StepperComponent.vue'
import DefaultSettings from '@/components/bookable-object/edit/DefaultSettings.vue'
import AccessSettings from '@/components/bookable-object/edit/AccessSettings.vue'
import AdditionalSettings from '@/components/bookable-object/edit/AdditionalSettings.vue'

import { bookableObjectRandomsSingular } from '@/assets/ts/constants'
import { useBookableObjects } from '@/stores/bookableObjects'

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

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <UseTemplate>
    <StepperComponent v-model="activeStep" :steps="steps">
      <template #step-0>
        <DefaultSettings ref="defaultSettings" :initial-values="steptoValues[0]">
          <template #footer>
            <DialogFooter>
              <Button type="button" @click="nextStep">
                Next
                <ChevronRightIcon class="h-4 w-4 ms-1" />
              </Button>
            </DialogFooter>
          </template>
        </DefaultSettings>
      </template>
      <template #step-1>
        <AccessSettings ref="accessSettings" :initial-values="steptoValues[1]">
          <template #footer>
            <div class="flex gap-2">
              <Button type="button" class="flex-grow" @click="activeStep--">
                <ChevronLeftIcon class="h-4 w-4 me-1" />
                Back
              </Button>
              <Button type="button" class="flex-grow" @click="nextStep">
                Next
                <ChevronRightIcon class="h-4 w-4 ms-1" />
              </Button>
            </div>
          </template>
        </AccessSettings>
      </template>
      <template #step-2>
        <AdditionalSettings ref="additionalSettings" :initial-values="steptoValues[2]">
          <template #footer>
            <div class="flex gap-2">
              <Button type="button" class="flex-grow" @click="activeStep--">
                <ChevronLeftIcon class="h-4 w-4 me-1" />
                Back
              </Button>
              <Button type="button" class="flex-grow" @click="nextStep">
                Create
                <RocketIcon class="h-4 w-4 ms-1" />
              </Button>
            </div>
          </template>
        </AdditionalSettings>
      </template>
    </StepperComponent>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="open">
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
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="open">
    <DrawerTrigger>
      <Button class="fixed bottom-0 right-0 m-3 h-14 w-14 rounded-2xl z-10" variant="default">
        <PlusCircledIcon class="w-6 h-6" />
      </Button>
    </DrawerTrigger>
    <DrawerContent class="max-h-screen">
      <DrawerHeader class="text-left">
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription> Make changes to your profile here. Click save when you're done. </DrawerDescription>
      </DrawerHeader>
      <div class="p-4 max-h-[60%] overflow-y-auto">
        <GridForm />
      </div>
    </DrawerContent>
  </Drawer>
</template>
