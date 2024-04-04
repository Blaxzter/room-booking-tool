<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { inject, ref } from 'vue'
import type { VueAuthenticate } from 'vue-authenticate-2'

const $auth = inject('$auth') as VueAuthenticate;

// set refs for email and password
const email = ref('');
const password = ref('');

const login = async () => {
  if (!$auth) return;
  await $auth.login({ email: email.value, password: password.value });
  // Execute application logic after successful login
};
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account.
      </CardDescription>
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
    </CardContent>
    <CardFooter>
      <Button class="w-full" type="submit" @click="login">
        Sign in
      </Button>
    </CardFooter>
  </Card>
</template>
