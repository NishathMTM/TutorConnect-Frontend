<script setup lang="ts">
const { title = 'Title' } = defineProps<{
   title: string;
   icon?: string;
}>();
</script>

<template>
   <div class="rounded-md border border-first-50 bg-first-50/50 p-3">
      <div class="flex gap-2">
         <aside class="text-second-400">
            <UIcon
               v-if="icon"
               class="6"
               :name="icon"
            />
         </aside>

         <div class="">
            <header class="text-[12px] font-bold uppercase text-second-400">
               {{ title }}
            </header>
            <div class="text-sm lg:text-base">
               <slot />
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
