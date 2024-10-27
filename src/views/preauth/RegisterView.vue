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
  <div v-if="visibleView === 'emailSend' && !hideRocket" class="rocket-wrapper">
    <RocketStartAnimation class="rocket" />
  </div>
  <main>
    <div class="flex justify-center items-center h-screen">
      <RegisterCard v-if="visibleView === 'register'" @email-send="setEmailVerified" />
      <EmailSendCard v-else-if="visibleView === 'emailSend'" />
    </div>
  </main>
</template>

<style lang="scss">
.rocket-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .rocket {
    min-width: 444px;
  }
}
</style>
