<script setup lang="ts">
import _ from 'lodash'
import { computed, onBeforeMount, ref, useAttrs } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { useGroups } from '@/stores/groups'
import { useUser } from '@/stores/user'

const { t } = useI18n()
const { name } = storeToRefs(useUser())
const attrs = useAttrs()
const { selectedGroupId, groups } = storeToRefs(useGroups())

const group = ref<string | undefined>(undefined)

const emit = defineEmits(['input'])

const props = defineProps({
  includePerson: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: true
  }
})

const getInitialGroup = (): string | undefined => {
  if (Object.keys(attrs).length > 0 && !_.isNil(attrs['modelValue'])) {
    return attrs['modelValue'] as string
  } else if (selectedGroupId.value) {
    return selectedGroupId.value
  } else if (props.includePerson) {
    return '-1'
  } else if (groups.value.length > 0) {
    return groups.value[0].id
  }
  console.error('GroupSelect: No group selected')
  return undefined
}

const selectedGroupValue = computed(() => {
  return group.value === '-1' ? t('bits.groupSelect.personal', { name: name.value }) : _.find(groups.value, { id: group.value })?.name
})

onBeforeMount(() => {
  group.value = getInitialGroup()
  emit('input', group.value)
})
</script>

<template>
  <Select v-model="group" v-bind="$attrs" :disabled="!editable">
    <FormControl>
      <SelectTrigger>
        <SelectValue :placeholder="t('bits.groupSelect.placeholder')" asChild>
          {{ selectedGroupValue }}
        </SelectValue>
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectGroup>
        <SelectItem :value="'-1'">
          <SelectItemText>{{ t('bits.groupSelect.noGroup') }}</SelectItemText>
          <div class="text-muted-foreground text-xs">{{ t('bits.groupSelect.personal', { name: name }) }}</div>
        </SelectItem>
      </SelectGroup>
      <template v-if="groups.length">
        <SelectSeparator />
        <SelectGroup>
          <SelectItem v-for="group in groups" :key="group.id" :value="group.id">
            <SelectItemText>
              {{ group.name }}
            </SelectItemText>
          </SelectItem>
        </SelectGroup>
      </template>
    </SelectContent>
  </Select>
</template>

<style scoped></style>
