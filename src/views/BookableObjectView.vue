<script setup lang="ts">
// get the bookable object id from the route
import { useRoute } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import CalenderComponent from '@/components/booking-components/CalenderComponent.vue'

const route = useRoute()

const bookableObjectId = route.params.id
</script>

<template>
  <div class="px-1 py-1 h-full md:py-6 md:px-6">
    <div
      class="grid h-full items-stretch gap-6 md:grid-cols-[400px_minmax(0,1fr)]"
    >
      <Card class="hidden flex-col space-y-4 sm:flex">
        <CardHeader>
          <CardTitle class="text-2xl"> Booking room information </CardTitle>
          <CardDescription> Room id: {{ bookableObjectId }} </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This is a room booking page. Here you can book a room for a meeting
            or an event.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CalenderComponent />
        </CardContent>
      </Card>
    </div>
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
