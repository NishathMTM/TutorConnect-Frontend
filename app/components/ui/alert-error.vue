<script setup lang="ts">

</script>

<template>
   <UAlert error="red" variant="soft" icon="i-uil:exclamation-triangle">
      <template #description>
         <slot />
      </template>
   </UAlert>
</template>

<style scoped lang="postcss">

</style>
