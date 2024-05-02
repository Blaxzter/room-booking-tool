<script setup lang="ts">
import { h, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { storeToRefs } from 'pinia'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { PlusCircledIcon } from '@radix-icons/vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { Textarea } from '@/components/ui/textarea'
import GroupSelect from '@/components/bits/GroupSelect.vue'

import NameFade from '@/components/utils/NameFade.vue'

import { useGroups } from '@/stores/groups'
import { bookableObjectRandoms } from '@/assets/ts/constants'

const { selectedGroup, selectedGroupId } = storeToRefs(useGroups())

const formSchema = toTypedSchema(
  z.object({
    name: z.string({
      required_error: 'Please enter a name.'
    }),
    description: z.string({
      required_error: 'Please enter a description.'
    }),
    groupName: z.string({
      required_error: 'Please select an email to display.'
    })
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    groupName: selectedGroupId.value
  }
})

// watch selectedGroup
watch(selectedGroup, (value) => {
  console.log('selectedGroup', value)
})

const onSubmit = handleSubmit((values) => {
  toast({
    title: 'You submitted the following values:',
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))
    )
  })
})
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
        <DialogDescription> Please find the details of your bookableObject. </DialogDescription>
      </DialogHeader>
      <form class="grid gap-4 py-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="The moon" v-bind="componentField" />
            </FormControl>
            <FormDescription> Please enter the name of the bookable object. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="The moon is a beautiful place." v-bind="componentField" />
            </FormControl>
            <FormDescription> Please enter the description of the bookable object. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="groupName">
          <FormItem>
            <FormLabel>Group</FormLabel>
            <GroupSelect :selectedGroup="componentField" />
            <FormDescription>
              Please select the group of the bookable object.
              <span v-if="selectedGroupId">Your currently selected group is chosen by default.</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <DialogFooter>
          <Button type="submit" class="min-w-[120px]">
            <span>Create <NameFade :messages="bookableObjectRandoms" /></span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
