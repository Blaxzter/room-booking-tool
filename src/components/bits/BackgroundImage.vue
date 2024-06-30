<script setup lang="ts"></script>

<template>
  <div class="background-image"></div>
  <p class="image-credit hidden sm:block">
    Photo by <a href="https://unsplash.com/de/fotos/foto-aus-dem-weltraum-Q1p7bh3SHj8">Nasa</a> on
    <a href="https://unsplash.com/">Unsplash</a>
  </p>
</template>

<style lang="scss">
.background-image {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1000;

  background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  filter: blur(2px) opacity(0.9);
  background-size: cover;
  background-position: center;
}

.image-credit {
  z-index: 1000;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0.5rem;
  font-size: 0.75rem;
  color: gray;
  text-shadow: 1px 1px 1px black;

  a {
    text-decoration: underline;
    pointer-events: auto;
    cursor: pointer;
  }
}
</style>
