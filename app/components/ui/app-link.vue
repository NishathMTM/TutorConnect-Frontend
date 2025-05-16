<script setup lang="ts">
defineProps<{
   to: string;
}>();
</script>

<template>
   <ULink :to class="text-first-500 hover:text-first-700">
      <slot></slot>
   </ULink>
</template>

<style scoped lang="postcss">

</style>
