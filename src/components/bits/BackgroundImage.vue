<script setup lang="ts"></script>

<template>
  <div class="background-image"></div>
  <p class="image-credit">
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

  background-image: url('http://localhost:8055/assets/6b264936-4945-4b60-90e1-5e6ba64d62e6');
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
