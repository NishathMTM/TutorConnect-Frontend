<script setup lang="ts">
import { useDraggable, useStorage, useWindowSize } from '@vueuse/core';
/* ------------------------------------------------------------------------------------------------ */

const breakpointsEl = ref<HTMLElement | null>(null);

const elLocation = useStorage('breakpoint-location', { x: 50, y: 10 });

const { x, y, style } = useDraggable(breakpointsEl, {
   initialValue: elLocation.value,
});

watchEffect(() => {
   elLocation.value.x = x.value;
   elLocation.value.y = y.value;
});
</script>

<template>
   <ClientOnly>
      <div
         ref="breakpointsEl"
         class="fixed cursor-pointer bottom-2 w-[35px] h-[35px] left-2 z-50 flex items-center justify-center rounded-full bg-primary font-bold text-white sm:flex"
         :style="style"
      >
         <div class="hidden sm:block md:hidden">
            SM
         </div>
         <div class="hidden md:block lg:hidden">
            MD
         </div>
         <div class="hidden lg:block xl:hidden">
            LG
         </div>
         <div class="hidden xl:block 2xl:hidden">
            XL
         </div>
         <div class="hidden 2xl:block">
            2XL
         </div>
      </div>
   </ClientOnly>
</template>

<style scoped></style>
