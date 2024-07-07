<script setup lang="ts">
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import GroupDataCard from '@/components/groups/bodys/GroupDataBody.vue'
</script>

<template>
  <DialogContent>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create group</DialogTitle>
        <DialogDescription> Add a new group to manage rooms and other bookable objects. </DialogDescription>
      </DialogHeader>
      <GroupDataCard @created="$emit('created', $event)" @close="$emit('close')">
        <DialogFooter>
          <Button variant="outline" @click="$emit('close')"> Cancel </Button>
          <Button type="submit" class="mb-2 sm:mb-0"> Continue </Button>
        </DialogFooter>
      </GroupDataCard>
    </DialogContent>
  </DialogContent>
</template>

<style></style>
