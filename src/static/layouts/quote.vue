<script setup>
defineProps({
  author: { type: String, default: '' },
  class: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout flex flex-col items-center justify-center h-full" :class="$props.class">
    <blockquote class="text-2xl italic opacity-80 max-w-2xl text-center">
      <slot />
    </blockquote>
    <p v-if="author" class="mt-4 text-lg opacity-60">— {{ author }}</p>
  </div>
</template>
