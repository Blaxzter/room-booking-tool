<script setup lang="ts">
import { CalendarDays, CalendarClock, CalendarFold } from 'lucide-vue-next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<template>
  <Tabs default-value="dayView">
    <TabsList>
      <TabsTrigger value="dayView" @click="$emit('toggle-day-view')">
        <CalendarDays />
      </TabsTrigger>
      <TabsTrigger value="timeView" @click="$emit('toggle-time-view')">
        <CalendarClock />
      </TabsTrigger>
      <TabsTrigger value="listView" @click="$emit('toggle-list-view')">
        <CalendarFold />
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>

<style scoped></style>
