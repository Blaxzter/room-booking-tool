<script setup lang="ts">
import { ref } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import { CircleIcon, CircleDotIcon, CircleCheckBigIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define steps with translation keys
const steps = ref([
  { key: 'stepper.steps.basicInfo', default: 'Basic Info' },
  { key: 'stepper.steps.permissions', default: 'Permissions' },
  { key: 'stepper.steps.additional', default: 'Additional' }
])

const activeStep = defineModel({ default: 0, required: true })
</script>

<template>
  <TabsRoot class="stepper" v-model="activeStep">
    <TabsList class="flex justify-between w-full px-2 py-2">
      <template v-for="(step, index) in steps" :key="index">
        <TabsTrigger
          :class="['stepper-trigger text-muted-foreground', { 'stepper-trigger-active': index === activeStep }]"
          :value="index"
          :disabled="activeStep <= index"
        >
          <div class="flex flex-col items-center">
            <div class="mb-1">
              <CircleIcon class="h-6 w-6" v-if="activeStep < index" />
              <CircleDotIcon class="h-6 w-6" v-else-if="activeStep === index" />
              <CircleCheckBigIcon class="h-6 w-6" v-else />
            </div>
            <div>
              {{ t(step.key, step.default) }}
            </div>
          </div>
        </TabsTrigger>
        <div v-if="index < steps.length - 1" class="flex-grow h-[2px] mx-2 mt-[10px] bg-secondary"></div>
      </template>
    </TabsList>
    <TabsContent :value="index" v-for="(step, index) in steps" :key="index" class="w-full">
      <slot :name="`step-${index}`"> {{ t('stepper.missingContent', { index }) || `Missing content for step ${index}` }} </slot>
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
