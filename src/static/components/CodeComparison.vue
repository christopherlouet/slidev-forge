<script setup>
defineProps({
  titleBefore: { type: String, default: 'Before' },
  titleAfter: { type: String, default: 'After' },
})
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <div class="text-sm font-bold mb-2 opacity-60">{{ titleBefore }}</div>
      <slot name="before" />
    </div>
    <div>
      <div class="text-sm font-bold mb-2 opacity-60">{{ titleAfter }}</div>
      <slot name="after" />
    </div>
  </div>
</template>
