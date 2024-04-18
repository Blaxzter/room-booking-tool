<script setup lang="ts">
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create team</DialogTitle>
      <DialogDescription>Add a new group to manage rooms and other bookable objects.</DialogDescription>
    </DialogHeader>
    <div>
      <div class="space-y-4 py-2 pb-4">
        <div class="space-y-2">
          <Label for="name">Team name</Label>
          <Input id="name" placeholder="Acme Inc." />
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" @click="$emit('close')"> Cancel </Button>
      <Button type="submit"> Continue </Button>
    </DialogFooter>
  </DialogContent>
</template>

<style scoped></style>
