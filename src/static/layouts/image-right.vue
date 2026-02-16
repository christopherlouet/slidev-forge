<script setup>
defineProps({
  image: { type: String, required: true },
  class: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout grid grid-cols-[60%_40%] gap-4 h-full" :class="$props.class">
    <div class="flex flex-col justify-center">
      <slot />
    </div>
    <div class="flex items-center justify-center">
      <img :src="image" class="max-h-full rounded shadow" />
    </div>
  </div>
</template>
