<script setup lang="ts">
// Define the type for individual image
interface CourseImage {
   id: number;
   courseId: number;
   isPrimary: boolean;
   imageUrlKey: string;
   imageUrl: string;
}

const props = defineProps<{
   images: CourseImage[];
}>();

// Process images to show primary image first
const processedImages = computed(() => {
   if (!props.images || !props.images.length) {
      return [];
   }

   const primaryImage = props.images.find(img => img.isPrimary);
   const primaryId = primaryImage?.id;

   let sortedImages: CourseImage[] = [];
   if (primaryImage) {
      const otherImages = props.images.filter(img => img.id !== primaryId);
      sortedImages = [primaryImage, ...otherImages];
   }
   else {
      sortedImages = [...props.images];
   }

   return sortedImages.slice(0, 5);
});

// Track loading state for each image
const loadedImages = ref(new Set<number>());
function handleImageLoad(imageId: number) {
   loadedImages.value.add(imageId);
}
</script>

<template>
   <div class="max-w-2xl mx-auto">
      <!-- No images message -->
      <div
         v-if="!processedImages.length"
         class="aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center"
      >
         <div class="text-center">
            <UIcon name="i-fluent:image-32-regular" class="size-12 text-gray-400 mb-2" />
            <p class="text-gray-500 font-medium">
               No images available
            </p>
         </div>
      </div>

      <!-- Image gallery grid -->
      <div v-else class="aspect-[16/9] grid grid-cols-12 gap-1.5 overflow-hidden rounded-xl bg-gray-100 p-1.5">
         <!-- Main large image -->
         <div class="relative col-span-8 h-full overflow-hidden rounded-lg group">
            <div
               v-if="!loadedImages.has(processedImages[0]?.id)"
               class="absolute inset-0 bg-gray-200 animate-pulse"
            />
            <img
               v-if="processedImages[0]"
               :src="processedImages[0].imageUrl"
               class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
               alt="Property main view"
               @load="handleImageLoad(processedImages[0].id)"
            >
            <div
               v-if="processedImages[0]?.isPrimary"
               class="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-full"
            >
               <UIcon name="i-fluent:star-12-filled" class="text-yellow-400" />
            </div>
         </div>

         <!-- Right side images -->
         <div class="col-span-4 grid grid-rows-2 gap-1.5 h-full">
            <!-- Top row -->
            <div class="grid grid-cols-2 gap-1.5">
               <div
                  v-for="(image, index) in processedImages.slice(1, 3)"
                  :key="image.id"
                  class="relative overflow-hidden rounded-lg group"
               >
                  <div
                     v-if="!loadedImages.has(image.id)"
                     class="absolute inset-0 bg-gray-200 animate-pulse"
                  />
                  <img
                     :src="image.imageUrl"
                     class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                     :alt="`Property view ${index + 1}`"
                     @load="handleImageLoad(image.id)"
                  >
               </div>
            </div>

            <!-- Bottom row -->
            <div class="grid grid-cols-2 gap-1.5">
               <div
                  v-for="(image, index) in processedImages.slice(3, 5)"
                  :key="image.id"
                  class="relative overflow-hidden rounded-lg group"
               >
                  <div
                     v-if="!loadedImages.has(image.id)"
                     class="absolute inset-0 bg-gray-200 animate-pulse"
                  />
                  <img
                     :src="image.imageUrl"
                     class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                     :alt="`Property view ${index + 3}`"
                     @load="handleImageLoad(image.id)"
                  >
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.animate-pulse {
   animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
   0%, 100% {
      opacity: 1;
   }
   50% {
      opacity: .5;
   }
}
</style>
