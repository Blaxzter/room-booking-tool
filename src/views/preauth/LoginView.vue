<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight, Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useUser } from '@/stores/user'
import router from '@/router'
import { Checkbox } from '@/components/ui/checkbox'
import { randomEmail } from '@/assets/ts/constants'
import AutoLoginCard from '@/components/login/AutoLoginCard.vue'
import BackgroundImage from '@/components/bits/BackgroundImage.vue'
import LogoImage from '@/components/bits/LogoImage.vue'

const loading = ref(false)
const showCheckmark = ref(false)
const showCross = ref(false)
const showScreenGrower = ref(false)

// set refs for email and password
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const keepLoggedIn = ref(false)
const showPassword = ref(false)

const { login, isAuthenticated, getRedirect } = useUser()

const loginWrapper = async () => {
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
      errorMessage.value = error.message
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
  <BackgroundImage />
  <main>
    <div class="flex justify-center items-center h-screen">
      <Card
        v-if="!isAuthenticated && !loading"
        class="rounded-none h-full w-full sm:max-w-sm sm:h-auto sm:rounded-xl place-content-center"
      >
        <CardHeader class="max-w-sm m-auto">
          <CardTitle>
            <div class="flex items-center gap-4 mb-3">
              <LogoImage />
              <div class="text-3xl font-bold">
                <div>BookiTool</div>
                <div class="text-2xl font-normal text-muted-foreground">Login</div>
              </div>
            </div>
          </CardTitle>
          <CardDescription> Enter your email below to login to your account. </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4 max-w-sm m-auto">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              :placeholder="randomEmail()"
              required
              @keyup.enter="loginWrapper"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <div class="relative w-full max-w-sm items-center">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                @keyup.enter="loginWrapper"
              />
              <Button
                class-name="absolute end-1 inset-y-0 flex items-center justify-center px-2"
                type="button"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class-name="text-current" :size="18" />
                <Eye v-else class-name="text-current" :size="18" />
              </Button>
            </div>
          </div>

          <!-- keep logged in -->
          <div class="flex items-center space-x-2 ms-2">
            <Checkbox id="keep_logged_in" v-model:checked="keepLoggedIn" />
            <label
              for="keep_logged_in"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keep me logged in
            </label>
          </div>

          <div v-if="errorMessage" class="flex items-center gap-2 text-red-500">
            <ChevronRight />
            {{ errorMessage }}
          </div>
        </CardContent>
        <CardFooter class="flex-col max-w-sm m-auto">
          <Button class="w-full" type="submit" @click="loginWrapper">
            <template v-if="loading">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Please wait
            </template>
            <template v-else> Sign in </template>
          </Button>
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <router-link to="/register" class="underline"> Sign up </router-link>
          </div>
        </CardFooter>
      </Card>
      <AutoLoginCard v-else :show-checkmark="showCheckmark" :show-cross="showCross" :loading="loading" />
    </div>
  </main>
</template>

<style lang="scss">
// import checkmark from '@/assets/css/login.scss'
@import '@/assets/css/login';
</style>
