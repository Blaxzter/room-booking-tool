<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { user } = storeToRefs(useUser())
const inputEmail = ref('')
const isEmailValid = computed(() => inputEmail.value !== user.value.email)

const { deleteUserRequest } = useUser()
</script>

<template>
  <AlertDialog>
    <Card class="w-full mt-80">
      <CardHeader>
        <CardTitle class="text-xl"> Delete account </CardTitle>
        <CardDescription>
          If you delete your account, all your data will be permanently removed from our servers. All bookable objects
          that you created, their bookings and all groups you created will be deleted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialogTrigger as-child>
          <Button type="submit" class="w-full" variant="destructive"> Delete account </Button>
        </AlertDialogTrigger>
      </CardContent>
    </Card>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          <div class="mb-2">
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </div>
          <div>
            Please type <code class="text-primary">{{ user.email }}</code> to confirm.
          </div>
          <Input v-model="inputEmail" type="text" class="w-full mt-4" placeholder="Type your email" />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction :disabled="isEmailValid" variant="destructive" @click="deleteUserRequest">
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
