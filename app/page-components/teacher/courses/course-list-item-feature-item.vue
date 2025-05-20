<script setup lang="ts">
const { title, icon } = defineProps<{
   title: string;
   icon?: string;
}>();
</script>

<template>
   <div
      class="flex items-center gap-3 rounded-lg border border-first-100 bg-first-100/50 px-3 py-1"
   >
      <div class="flex items-center text-second-400 text-xs uppercase">
         <UIcon
            v-if="icon"
            class="feature-item-icon size-5"
            :name="icon"
         />
      </div>
      <div class="shrink-0 font-bold text-second-400 text-xs">
         <slot />
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
