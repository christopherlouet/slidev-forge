<script setup>
defineProps({
  class: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout" :class="$props.class">
    <slot name="header" />
    <div class="grid grid-cols-2 gap-4 mt-4 flex-1">
      <div>
        <slot />
      </div>
      <div>
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
