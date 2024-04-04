<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Terminal } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { computed, inject, ref } from 'vue'
import type { VueAuthenticate } from 'vue-authenticate-2'
import { Loader2 } from 'lucide-vue-next'
import router from '@/router'

const $auth = inject('$auth') as VueAuthenticate;

const loading = ref(false);

// set refs for email and password
const email = ref('');
const password = ref('');
const error = ref('');

const login = async () => {
  if (!$auth) return;
  loading.value = true;
  await $auth.login({ email: email.value, password: password.value }).then((res) => {
    $auth.setToken(res.data)
    router.push({ name: 'home' });
  }).catch((error) => {
    console.error(error);
    error.value = error?.response?.data?.message;
  }).finally(() => {
    loading.value = false;
  });
  // Execute application logic after successful login
};

// computed on $auth.isAuthenticated
const isAuthenticated = computed(() => {
  return $auth.isAuthenticated();
})

</script>

<template>


  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login {{ isAuthenticated ? 'Success' : 'Failed' }}
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

      <Alert v-if="error">
        <Terminal class="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>

    </CardContent>
    <CardFooter>
      <Button class="w-full" type="submit" @click="login">
        <template v-if="loading">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          Please wait
        </template>
        <template v-else>
          Sign in
        </template>
      </Button>
    </CardFooter>
  </Card>
</template>
