<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUser } from '@/stores/user'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { t } = useI18n()
const { user } = storeToRefs(useUser())
const inputEmail = ref('')
const isEmailValid = computed(() => inputEmail.value !== user.value.email)

const { deleteUserRequest } = useUser()
</script>

<template>
  <AlertDialog>
    <Card class="w-full mt-8">
      <CardHeader>
        <CardTitle class="text-xl">{{
          t('settings.account.deleteAccount.title')
        }}</CardTitle>
        <CardDescription>
          {{ t('settings.account.deleteAccount.description') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialogTrigger as-child>
          <Button type="submit" class="w-full" variant="destructive">{{
            t('settings.account.deleteAccount.button')
          }}</Button>
        </AlertDialogTrigger>
      </CardContent>
    </Card>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{
          t('settings.account.deleteAccount.confirmation.title')
        }}</AlertDialogTitle>
        <AlertDialogDescription>
          <div class="mb-2">
            {{ t('settings.account.deleteAccount.confirmation.warning') }}
          </div>
          <div
            v-html="
              t('settings.account.deleteAccount.confirmation.typeEmail', {
                email: `<code class='text-primary'>${user.email}</code>`
              })
            "
          ></div>
          <Input
            type="text"
            class="w-full mt-4"
            :placeholder="
              t('settings.account.deleteAccount.confirmation.emailPlaceholder')
            "
            v-model="inputEmail"
          />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction
          :disabled="isEmailValid"
          variant="destructive"
          @click="deleteUserRequest"
        >
          {{ t('common.continue') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
