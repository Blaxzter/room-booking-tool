<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { storeToRefs } from 'pinia'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useI18n } from 'vue-i18n'

import { useGlobalSettings } from '@/stores/globalSettings'
import { useUser } from '@/stores/user'

const { t } = useI18n()
const { isDemoUser, demoDialogOpen } = storeToRefs(useGlobalSettings())
const { user } = storeToRefs(useUser())

const dontShowAgain = ref(false)
const message = ref('')
const contactEmail = ref(user.value?.email)
const error_message = ref('')
const error_message_contact = ref('')

defineEmits(['close', 'created'])

// Prop that shows the Dialog Trigger
const props = defineProps({
  startOpen: {
    type: Boolean,
    default: true
  },
  identifier: {
    type: String,
    default: '1'
  }
})

const dontShowAgainChange = () => {
  dontShowAgain.value = !dontShowAgain.value
  localStorage.setItem('dontShowAgainDemoMode', dontShowAgain.value.toString())
}

// On mounted
onBeforeMount(async () => {
  // check local storage for the dontShowAgain value
  const dontShowAgainValue = localStorage.getItem('dontShowAgainDemoMode')
  dontShowAgain.value = dontShowAgainValue === 'true'

  // Set the dialog's visibility state to the prop value
  demoDialogOpen.value = props.startOpen && isDemoUser.value
  if (props.startOpen && isDemoUser.value && dontShowAgain.value) {
    demoDialogOpen.value = false
  }
})

import { useToast } from '@/components/ui/toast'

import axios from 'axios'
import type { AxiosResponse } from 'axios'
const backendUrl = inject('backendUrl')

const validateEmail = () => {
  return String(contactEmail.value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const sendMemberRequest = async () => {
  const { toast } = useToast()
  let isError = false
  if (message.value.length <= 10) {
    error_message.value = t('demoMode.contactRequest.validation.messageLength')
    isError = true
  }

  if (!validateEmail()) {
    error_message_contact.value = t(
      'demoMode.contactRequest.validation.invalidEmail'
    )
    isError = true
  }

  if (isError) {
    return
  }

  await axios
    .post(
      `${backendUrl}/flows/trigger/67797215-97a3-4e68-8191-547fcae7a23d`,
      {
        message: message.value,
        contactEmail: contactEmail.value
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    )
    .then(async (res: AxiosResponse<any>) => {
      console.log('res:', res)
      if (res.data.name === 'DirectusError') {
        toast({
          title: t('demoMode.contactRequest.toast.error.title'),
          description:
            res.data.code === '400'
              ? t('demoMode.contactRequest.toast.error.userExists')
              : t('demoMode.contactRequest.toast.error.description'),
          variant: 'destructive'
        })
        return
      }
      toast({
        title: t('demoMode.contactRequest.toast.requestSent.title'),
        description: t('demoMode.contactRequest.toast.requestSent.description'),
        variant: 'success'
      })
    })
    .catch((err) => {
      console.error('err:', err)
      toast({
        title: t('demoMode.contactRequest.toast.error.title'),
        description: t('demoMode.contactRequest.toast.error.description'),
        variant: 'destructive'
      })
    })
  demoDialogOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="demoDialogOpen" v-if="isDemoUser">
    <DialogContent class="sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle>{{ t('demoMode.title') }}</DialogTitle>
        <DialogDescription>
          <div>
            {{ t('demoMode.description') }}
          </div>
          <div>- {{ t('demoMode.limits.objects') }}</div>
          <div>- {{ t('demoMode.limits.requests') }}</div>
          <div>- {{ t('demoMode.limits.groups') }}</div>

          <div class="mt-2">
            {{ t('demoMode.contactRequest.intro') }}
          </div>
        </DialogDescription>
      </DialogHeader>
      <div class="items-center">
        <Label for="contactEmail">
          {{ t('demoMode.contactRequest.emailLabel') }}
        </Label>
        <Input id="contactEmail" type="email" v-model="contactEmail" />
        <div class="text-muted-foreground text-sm mt-2">
          {{ t('demoMode.contactRequest.emailHelp') }}
        </div>
        <div class="text-destructive text-sm mt-2" v-if="error_message_contact">
          {{ error_message_contact }}
        </div>
      </div>
      <div class="items-center">
        <Label for="message">
          {{ t('demoMode.contactRequest.messageLabel') }}
        </Label>
        <Textarea
          id="message"
          :placeholder="t('demoMode.contactRequest.messagePlaceholder')"
          class="col-span-3"
          v-model="message"
        />
        <div class="text-muted-foreground text-sm mt-2">
          {{ t('demoMode.contactRequest.messageHelp') }}
        </div>
        <div class="text-destructive text-sm mt-2" v-if="error_message">
          {{ error_message }}
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <Label for="demo-checkbox" class="flex items-center space-x-1">
          <Checkbox
            id="demo-checkbox"
            type="checkbox"
            :model-value="dontShowAgain"
            @update:model-value="dontShowAgainChange"
          />
          <span>{{ t('demoMode.contactRequest.dontShowAgain') }}</span>
        </Label>
      </div>

      <DialogFooter class="flex justify-between">
        <Button type="submit" @click="sendMemberRequest">
          {{ t('demoMode.contactRequest.sendRequest') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
