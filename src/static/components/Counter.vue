<script setup>
import { ref } from 'vue'

const props = defineProps({
  start: { type: Number, default: 0 },
})

const count = ref(props.start)
</script>

<template>
  <div class="flex gap-2 items-center">
    <button class="border rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800" @click="count--">-</button>
    <span class="text-xl font-mono">{{ count }}</span>
    <button class="border rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800" @click="count++">+</button>
  </div>
</template>
