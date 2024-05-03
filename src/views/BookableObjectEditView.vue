<script setup lang="ts">
// get the bookable object id from the route
import { useRoute } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CalenderComponent from '@/components/booking-components/CalenderComponent.vue'

const route = useRoute()

const bookableObjectId = route.params.id
</script>

<template>
  <div>
    Here you will be able to edit the bookable object properties of the object with the id: {{ bookableObjectId }}
  </div>
</template>

<style class="scss"></style>
