<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'

import EmailVerifiedCard from '@/components/login/EmailVerifiedCard.vue'
import BackgroundImage from '@/components/bits/BackgroundImage.vue'
import { useToast } from '@/components/ui/toast'

import { useUser } from '@/stores/user'
import EmailVerificationCard from '@/components/login/EmailVerificationCard.vue'

const visibleView = ref('verification')

onMounted(() => {
  setTimeout(() => {
    const { toast } = useToast()
    const { verifyEmail } = useUser()

    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) {
      toast({
        variant: 'warning',
        title: 'No token found',
        description: 'No token was found in the URL. Please check your email for the verification link.'
      })
      router.replace({ name: 'login' })
      return
    }

    verifyEmail(token)
      .then(() => {
        visibleView.value = 'verified'
        setTimeout(() => {
          router.replace({ name: 'login' })
        }, 5000)
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Invalid token',
          description: 'The token is invalid, has expired or has already been used.'
        })
        router.replace({ name: 'login' })
      })
  }, 3000)
})
</script>

<template>
  <BackgroundImage />
  <main>
    <div class="flex justify-center items-center h-screen">
      <EmailVerificationCard v-if="visibleView === 'verification'" />
      <EmailVerifiedCard v-else />
    </div>
  </main>
</template>

<style lang="scss">
.rocket {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
