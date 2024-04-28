<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight, Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'

import { Loader2 } from 'lucide-vue-next'
import { useAuth } from '@/stores/auth'
import router from '@/router'
import { onMounted } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'

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

const { login, isAuthenticated, getRedirect } = useAuth()

const loginWrapper = async () => {
  loading.value = true
  errorMessage.value = ''

  await login({
    email: email.value,
    password: password.value,
    keep_logged_in: keepLoggedIn.value
  })
    .then(() => {
      console.log('Logged in')
      showCheckmark.value = true
      setTimeout(() => {
        showScreenGrower.value = true
        console.log('show screen grower')
      }, 900)
      setTimeout(() => {
        let to = getRedirect() || { name: 'home' }
        console.log('Redirecting to', to)
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
      showScreenGrower.value = true
    }, 1900)
    setTimeout(() => {
      let to = getRedirect() || { name: 'home' }
      console.log('Redirecting to', to)
      router.push(to)
    }, 2000)
  }
})
</script>

<template>
  <div class="background-image fixed inset-0 z-0"></div>
  <main>
    <div class="flex justify-center items-center h-screen">
      <Card class="w-full max-w-sm" v-if="!isAuthenticated && !loading">
        <CardHeader>
          <CardTitle class="text-2xl"> Login </CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              v-model="email"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <div class="relative w-full max-w-sm items-center">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                required
                v-model="password"
              />
              <Button
                @click="showPassword = !showPassword"
                className="absolute end-1 inset-y-0 flex items-center justify-center px-2"
                type="button"
              >
                <EyeOff
                  v-if="showPassword"
                  className="text-current"
                  :size="18"
                />
                <Eye v-else className="text-current" :size="18" />
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
        <CardFooter>
          <Button class="w-full" type="submit" @click="loginWrapper">
            <template v-if="loading">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Please wait
            </template>
            <template v-else> Sign in </template>
          </Button>
        </CardFooter>
      </Card>
      <Card
        class="w-full max-w-sm h-full max-h-[200px]"
        v-else
        :class="{ 'login-screen-grower': showScreenGrower }"
      >
        <CardContent
          class="grid place-items-center pt-6"
          :class="{ 'fade-out': showScreenGrower }"
        >
          <div
            class="circle-loader mb-2 h-[200px]"
            :class="{ 'load-complete': showCheckmark, error: showCross }"
          >
            <div
              class="checkmark draw"
              :style="{ display: !showCheckmark ? 'none' : 'block' }"
            ></div>
            <div
              class="cross draw"
              :style="{ display: !showCross ? 'none' : 'block' }"
            ></div>
          </div>
          <CardTitle v-if="showCheckmark"> Authenticated </CardTitle>
          <CardTitle v-else-if="showCross">
            Invalid email or password
          </CardTitle>
          <CardTitle v-else> Logging in </CardTitle>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<style lang="scss">
// import checkmark from '@/assets/css/login.scss'
@import '@/assets/css/login';

.background-image {
  z-index: -1000;
  background-image: url('https://source.unsplash.com/random/?Nature&Landscape&horizontal&hd');
  filter: blur(2px) opacity(0.9);
  background-size: cover;
  background-position: center;
}
</style>
