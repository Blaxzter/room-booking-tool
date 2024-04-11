<script setup lang="ts">
// get the bookable object id from the route
import { useRoute } from 'vue-router'

const route = useRoute()

const bookableObjectId = route.params.id
</script>

<template>
  <div class="about">
    <h1>This is an about page {{ bookableObjectId }}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
