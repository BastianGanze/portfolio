<script setup lang="ts">
import { version } from './package.json'
</script>

<template>
  <div>
    <button class="btn">
      Button
    </button>
    <h1 class="text-3xl font-bold underline">
      Try something different again. {{ version }}
    </h1>
  </div>
</template>
