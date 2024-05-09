<script setup lang="ts">
import { ref, watch } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import { CircleIcon, CircleCheckBigIcon } from 'lucide-vue-next'

const steps = ref(['Basic Info', 'Permissions', 'Additional'])

const activeStep = defineModel({ default: 0, required: true })

watch(activeStep, (newValue) => {
  console.log('activeStep', newValue)
})
</script>

<template>
  <TabsRoot class="stepper" v-model="activeStep">
    <TabsList class="flex justify-between w-full px-2 py-2">
      <template v-for="(step, index) in steps" :key="index">
        <TabsTrigger
          :class="['stepper-trigger mb-3', { 'stepper-trigger-active': index === activeStep }]"
          :value="index"
          :disabled="activeStep <= index"
        >
          <div class="flex flex-col items-center">
            <div class="mb-1">
              <CircleIcon class="h-6 w-6" v-if="activeStep <= index" />
              <CircleCheckBigIcon class="h-6 w-6" v-else />
            </div>
            <div>
              {{ step }}
            </div>
          </div>
        </TabsTrigger>
        <div v-if="index < steps.length - 1" class="flex-grow h-[2px] mx-2 mt-[10px] bg-secondary"></div>
      </template>
    </TabsList>
    <TabsContent :value="index" v-for="(step, index) in steps" :key="index">
      <slot :name="`step-${index}`"> Missing content for step {{ index }} </slot>
    </TabsContent>
  </TabsRoot>
</template>

<style lang="scss">
.stepper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stepper-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: hsl(var(--secondary));
}

.stepper-trigger-active {
  color: hsl(var(--primary));
}
</style>
