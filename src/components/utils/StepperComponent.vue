<script setup lang="ts">
import { ref } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import { CircleCheckBigIcon, CircleDotIcon, CircleIcon } from 'lucide-vue-next'

const steps = ref(['Basic Info', 'Permissions', 'Additional'])

const activeStep = defineModel({ default: 0, required: true })
</script>

<template>
  <TabsRoot v-model="activeStep" class="stepper">
    <TabsList class="flex justify-between w-full px-2 py-2">
      <template v-for="(step, index) in steps" :key="index">
        <TabsTrigger
          :class="['stepper-trigger text-muted-foreground', { 'stepper-trigger-active': index === activeStep }]"
          :value="index"
          :disabled="activeStep <= index"
        >
          <div class="flex flex-col items-center">
            <div class="mb-1">
              <CircleIcon v-if="activeStep < index" class="h-6 w-6" />
              <CircleDotIcon v-else-if="activeStep === index" class="h-6 w-6" />
              <CircleCheckBigIcon v-else class="h-6 w-6" />
            </div>
            <div>
              {{ step }}
            </div>
          </div>
        </TabsTrigger>
        <div v-if="index < steps.length - 1" class="flex-grow h-[2px] mx-2 mt-[10px] bg-secondary"></div>
      </template>
    </TabsList>
    <TabsContent v-for="(step, index) in steps" :key="index" :value="index" class="w-full">
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
}

.stepper-trigger-active {
  color: hsl(var(--primary));
}
</style>
