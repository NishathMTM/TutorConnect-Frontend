<script setup lang="ts">
const { loading } = defineProps<{
   loading?: boolean;
}>();
</script>

<template>
   <UButton
      color="primary"
      :icon="iconLibrary.actions.create"
      :loading
   >
      <slot>Create</slot>
   </UButton>
</template>

<style scoped lang="postcss"></style>
