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
import { Terminal } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ref } from 'vue'

import { Loader2 } from 'lucide-vue-next'
import { useAuth } from '@/stores/auth'
import router from '@/router'
import { onMounted } from 'vue'

const loading = ref(false)
const showCheckmark = ref(false)

// set refs for email and password
const email = ref('')
const password = ref('')
const error = ref('')

const { login, isAuthenticated } = useAuth()

const loginWrapper = async () => {
  loading.value = true
  error.value = ''

  await login({ email: email.value, password: password.value })
    .then(() => {
      console.log('Logged in')
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1000)
    })
    .catch((error) => {
      console.error(error)
      error.value = 'Invalid email or password'
    })
  loading.value = false
}

// on mounted check if user is authenticated
onMounted(async () => {
  if (isAuthenticated) {
    setTimeout(() => {
      showCheckmark.value = true
    }, 1000)
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 2000)
  }
})
</script>

<template>
  <div class="background-image fixed inset-0 z-0"></div>
  <main>
    {{ isAuthenticated }}
    <div class="flex justify-center items-center h-screen">
      <Card class="w-full max-w-sm" v-if="!isAuthenticated">
        <CardHeader>
          <CardTitle class="text-2xl"> Login </CardTitle>
          <CardDescription> Enter your email below to login to your account. </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" required v-model="password" />
          </div>

          <Alert v-if="error">
            <Terminal class="h-4 w-4" />
            <AlertTitle> Error </AlertTitle>
            <AlertDescription> {{ error }} </AlertDescription>
          </Alert>
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
      <Card class="w-full max-w-sm" v-else>
        <CardContent class="grid place-items-center pt-6">
          <div class="circle-loader mb-2" :class="{ 'load-complete': showCheckmark }">
            <div
              class="checkmark draw"
              :style="{ display: !showCheckmark ? 'none' : 'block' }"
            ></div>
          </div>
          <CardTitle v-if="showCheckmark"> Authenticated </CardTitle>
          <CardTitle v-else> Logging in </CardTitle>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<style lang="scss">
// import checkmark from '@/assets/css/checkmark.scss'
@import '@/assets/css/checkmark.scss';

.background-image {
  z-index: -1000;
  background-image: url('https://source.unsplash.com/random?orientation=landscape&collections=11649432');
  filter: blur(2px) opacity(0.9);
  background-size: cover;
  background-position: center;
}
</style>
