<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/composables/useLanguage'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'
import DeleteAccountDialog from '@/components/settings/DeleteAccountDialog.vue'
import TelegramLogin from '@/components/settings/TelegramLogin.vue'
import { ref } from 'vue'
import { useUser } from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { UpdateUserRequest } from '@/types'

const { t } = useI18n()
const { currentLanguage, availableLanguages, changeLanguage } = useLanguage()
const { toast } = useToast()
const { updateUserData } = useUser()
const { user } = storeToRefs(useUser())
const language = ref(user.value.language || currentLanguage.value.code)

const updateLanguage = async (langCode: string) => {
  language.value = langCode
  changeLanguage(langCode)

  // Update user language in backend
  try {
    await updateUserData({
      language: langCode
    } as UpdateUserRequest)

    toast({
      title: t('settings.language.toast.success.title'),
      description: t('settings.language.toast.success.description'),
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: t('settings.language.toast.error.title', 'Error'),
      description: t(
        'settings.language.toast.error.description',
        'Failed to update language preference'
      ),
      variant: 'destructive'
    })
    console.error(error)
  }
}
</script>

<template>
  <div>
    <div class="text-xl font-bold mb-5">{{ t('settings.language.title') }}</div>
    <div class="mb-8">
      <FormField v-slot="{}" name="language" :model-value="language">
        <FormItem>
          <FormLabel>{{ t('settings.language.preferredLanguage') }}</FormLabel>
          <FormControl>
            <RadioGroup v-model="language" class="mt-3">
              <div
                v-for="lang in availableLanguages"
                :key="lang.code"
                class="flex items-center space-x-2 rounded-md border p-4 mb-1 cursor-pointer"
                :class="{ 'bg-accent border-primary': language === lang.code }"
                @click="updateLanguage(lang.code)"
              >
                <RadioGroupItem :value="lang.code" :id="lang.code" />
                <Label
                  :for="lang.code"
                  class="flex items-center gap-3 cursor-pointer"
                >
                  <span class="text-xl ms-2">{{ lang.flag }}</span>
                  <span class="font-medium">{{ lang.name }}</span>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            {{ t('settings.language.preferredLanguageHelp') }}
          </FormDescription>
        </FormItem>
      </FormField>
    </div>
    <Separator class="my-6" />

    <div>
      <div class="text-xl font-bold mb-5">
        {{ t('settings.account.integrations') }}
      </div>
      <TelegramLogin />
    </div>

    <Separator class="my-6" />

    <DeleteAccountDialog />
  </div>
</template>
