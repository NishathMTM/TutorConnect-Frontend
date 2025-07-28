<script setup lang="ts">
import { iconLibrary } from '~/utils/icons-utils';
</script>

<template>
   <UButton
      color="error"
      :icon="iconLibrary.actions.cancel"
   >
      <slot>Cancel</slot>
   </UButton>
</template>

<style scoped lang="postcss"></style>
