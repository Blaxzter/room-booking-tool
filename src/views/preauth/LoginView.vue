<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import { ChevronRight, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

import { useI18n } from 'vue-i18n'
import { useUser } from '@/stores/user'
import { randomEmail } from '@/assets/ts/constants'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import AutoLoginCard from '@/components/login/AutoLoginCard.vue'
import BackgroundImage from '@/components/bits/BackgroundImage.vue'
import LogoImage from '@/components/bits/LogoImage.vue'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher.vue'

const { t } = useI18n()

const loading = ref(false)
const showCheckmark = ref(false)
const showCross = ref(false)
const showScreenGrower = ref(false)

// set refs for email and password
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const keepLoggedIn = ref(true)
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')

const { login, isAuthenticated, getRedirect } = useUser()

const validateForm = () => {
  let isValid = true

  // Reset error messages
  emailError.value = ''
  passwordError.value = ''

  if (!email.value.trim()) {
    emailError.value = t('login.emailRequired', 'Email is required')
    isValid = false
  }

  if (!password.value) {
    passwordError.value = t('login.passwordRequired', 'Password is required')
    isValid = false
  }

  return isValid
}

const loginWrapper = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  await login({
    email: email.value,
    password: password.value,
    keep_logged_in: keepLoggedIn.value
  })
    .then(() => {
      showCheckmark.value = true
      setTimeout(() => {
        showScreenGrower.value = true
      }, 900)
      setTimeout(() => {
        const to = getRedirect() || { name: 'home' }
        router.push(to)
      }, 1000)
    })
    .catch((error) => {
      showCross.value = true
      setTimeout(() => {
        showCross.value = false
        loading.value = false
      }, 1000)

      console.log(error.message)

      // Handle error response with proper i18n
      if (error.code) {
        // We're dealing with an AuthError with a code
        // Map error codes to i18n keys
        const errorKeys: Record<string, string> = {
          INVALID_CREDENTIALS: 'login.errors.invalidCredentials',
          ACCOUNT_LOCKED: 'login.errors.accountLocked',
          ACCOUNT_DISABLED: 'login.errors.accountDisabled'
          // Add more error code mappings as needed
        }

        errorMessage.value = t(
          errorKeys[error.code] || 'login.errors.generic',
          error.message
        )
      } else {
        // Generic error fallback
        errorMessage.value = error.message
          ? t('login.errors.generic', error.message)
          : t('login.errors.unknown')
      }
    })
}

// on mounted check if user is authenticated
onMounted(async () => {
  if (isAuthenticated) {
    setTimeout(() => {
      showCheckmark.value = true
    }, 1000)
    setTimeout(() => {
      const to = getRedirect() || { name: 'home' }
      router.push(to)
    }, 2000)
  }
})
</script>

<template>
  <div>
    <BackgroundImage />
    <main>
      <div class="flex justify-center items-center h-screen">
        <Card
          v-if="!isAuthenticated && !loading"
          class="rounded-none h-full w-full sm:max-w-sm sm:h-auto sm:rounded-xl place-content-center"
        >
          <CardHeader class="max-w-sm m-auto">
            <div class="flex justify-between items-start">
              <CardTitle>
                <div class="flex items-center gap-4 mb-3">
                  <LogoImage />
                  <div class="text-3xl font-bold">
                    <div>BookiTool</div>
                    <div class="text-2xl font-normal text-muted-foreground">
                      {{ t('login.title') }}
                    </div>
                  </div>
                </div>
              </CardTitle>
              <LanguageSwitcher variant="ghost" :flagSize="20" />
            </div>
            <CardDescription>{{ t('login.description') }}</CardDescription>
          </CardHeader>
          <form @submit.prevent="loginWrapper">
            <CardContent class="grid gap-4 max-w-sm m-auto">
              <div class="grid gap-2">
                <Label for="email">{{ t('login.email') }}</Label>
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  autocomplete="username"
                  :placeholder="randomEmail()"
                  required
                  :class="{ 'border-red-500': emailError }"
                  @keyup.enter="loginWrapper"
                />
                <p v-if="emailError" class="text-sm text-red-500 mt-1">
                  {{ emailError }}
                </p>
              </div>
              <div class="grid gap-2">
                <Label for="password">{{ t('login.password') }}</Label>
                <div class="relative w-full max-w-sm items-center">
                  <Input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    :class="{ 'border-red-500': passwordError }"
                    @keyup.enter="loginWrapper"
                  />
                  <Button
                    className="absolute end-1 inset-y-0 flex items-center justify-center px-2"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <EyeOff
                      v-if="showPassword"
                      className="text-current"
                      :size="18"
                    />
                    <Eye v-else className="text-current" :size="18" />
                  </Button>
                </div>
                <p v-if="passwordError" class="text-sm text-red-500 mt-1">
                  {{ passwordError }}
                </p>
              </div>

              <!-- keep logged in -->
              <div class="flex items-center space-x-2 ms-2">
                <Checkbox id="keep_logged_in" v-model="keepLoggedIn" />
                <label
                  for="keep_logged_in"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ t('login.keepLoggedIn') }}
                </label>
              </div>

              <div
                v-if="errorMessage"
                class="flex items-center gap-2 text-red-500"
              >
                <ChevronRight />
                {{ errorMessage }}
              </div>
            </CardContent>
            <CardFooter class="flex-col max-w-sm m-auto">
              <Button class="w-full" type="submit">
                <template v-if="loading">
                  <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                  {{ t('login.pleaseWait') }}
                </template>
                <template v-else>{{ t('login.signIn') }}</template>
              </Button>
              <div class="mt-4 text-center text-sm">
                {{ t('login.noAccount') }}
                <router-link to="/register" class="underline">{{
                  t('login.signUp')
                }}</router-link>
              </div>
            </CardFooter>
          </form>
        </Card>
        <AutoLoginCard
          v-else
          :showCheckmark="showCheckmark"
          :showCross="showCross"
          :loading="loading"
        />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
// import checkmark from '@/assets/css/login.scss'
@use '@/assets/css/login';
</style>
