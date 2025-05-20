<script setup lang="ts">
const { secondary = false } = defineProps<{
   secondary?: boolean;
}>();
</script>

<template>
   <h1
      class="font-bold text-3xl" :class="[
         secondary ? 'text-second-500' : 'text-primaryColor',
      ]"
   >
      <slot />
   </h1>
</template>

<style scoped lang="postcss">

</style>
