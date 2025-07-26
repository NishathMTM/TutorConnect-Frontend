<script setup lang="ts">
import type { CourseImage } from '~~/__backend/courses/types';

const { images } = defineProps<{
   images: CourseImage[];
}>();

const selectedImages = computed(() => {
   if (images.length > 3) {
      return images.slice(0, 3);
   }
   return images;
});
</script>

<template>
   <div
      v-if="selectedImages.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-3"
   >
      <div class="md:col-span-2">
         <img
            class="h-64 md:h-32 w-full object-cover rounded-lg"
            :src="selectedImages[0]?.imageUrl"
            alt=""
         >
      </div>

      <div class="hidden md:block">
         <img
            class="h-32 w-full object-cover rounded-lg"
            :src="selectedImages[1]?.imageUrl"
            alt=""
         >
      </div>

      <div class="hidden md:block">
         <img
            class="h-32 w-full object-cover rounded-lg"
            :src="selectedImages[2]?.imageUrl"
            alt=""
         >
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
