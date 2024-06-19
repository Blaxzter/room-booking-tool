<script setup lang="ts">
import BackgroundImage from '@/components/bits/BackgroundImage.vue'
import RegisterCard from '@/components/login/RegisterCard.vue'
import EmailSendCard from '@/components/login/EmailSendCard.vue'
import { ref } from 'vue'
import RocketStartAnimation from '@/components/animations/RocketStartAnimation.vue'

const visibleView = ref('register')
const hideRocket = ref(false)

const setEmailVerified = () => {
  visibleView.value = 'emailSend'
  setTimeout(() => {
    hideRocket.value = true
  }, 3000)
}
</script>

<template>
  <BackgroundImage />
  <main>
    <div class="flex justify-center items-center h-screen">
      <RegisterCard @email-send="setEmailVerified" v-if="visibleView === 'register'" />
      <EmailSendCard v-else-if="visibleView === 'emailSend'" />
    </div>
  </main>
  <RocketStartAnimation class="rocket" v-if="visibleView === 'emailSend' && !hideRocket" />
</template>

<style lang="scss">
.rocket {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
