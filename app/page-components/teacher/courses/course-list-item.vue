<script setup lang="ts">
import type { Course, CourseImage } from '~~/__backend/courses/types';
import ImagePlaceholder from '~/components/ui/image-placeholder.vue';
import { iconLibrary } from '~/utils/icons-utils';
/* ---------------------------------------------------------------------------------------------- */

const { course } = defineProps<{
   course: Course;

}>();

const courseImages = computed(() => {
   const images: CourseImage[] = [];

   if (course.primaryImage) {
      images.push(course.primaryImage);
   }

   images.push(...course.courseImages.slice(0, 2));

   return images;
});

/* ---------------------------------------------------------------------------------------------- */

function getCourseLink() {
   return `/app/teacher/courses/${course.id}`;
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div
      class="overflow-hidden rounded-xl border border-first-100 bg-first-50/20 transition-all lg:flex-row lg:p-2"
   >
      <!-- region: heading -->
      <div class="p-2 lg:mb-3">
         <div class="mb-1 flex justify-between">
            <div
               class="flex items-center justify-center gap-2 rounded-full bg-first-500 px-4 text-xs text-first-50"
            >
               <UIcon :name="iconLibrary.course.type" />
               {{ course.courseType.courseType }}
            </div>

            <div class="flex items-center gap-1 font-semibold text-second-400">
               <UIcon
                  class="size-5"
                  :name="iconLibrary.map"
               />
               {{ course.courseCategory.courseCategory }}
            </div>
         </div>

         <NuxtLink
            class="text-xl font-semibold text-first-500 hover:text-first-700 hover:underline"
            :to="getCourseLink()"
         >
            {{ course.description }}
         </NuxtLink>
      </div>
      <!-- endregion: heading -->

      <!-- region: body -->
      <div class="flex flex-col gap-3 lg:flex-row">
         <aside class="w-full shrink-0 overflow-hidden lg:w-64 2xl:w-64">
            <div class="grid h-40 grid-cols-3 gap-2">
               <div class="col-span-2">
                  <NuxtImg
                     v-if="courseImages[0]"
                     class="h-40 w-full object-cover lg:h-40 lg:w-48 lg:rounded-lg 2xl:w-64"
                     :src="courseImages[0].imageUrl"
                     alt=""
                     placeholder="/property-placeholder.svg"
                     @click="() => navigateTo(getCourseLink())"
                  />
                  <ImagePlaceholder
                     v-else
                     class="lg:rounded-lg"
                  />
               </div>

               <div class="grid grid-rows-2 gap-2">
                  <NuxtImg
                     v-if="courseImages[1]"
                     class="h-full w-full object-cover lg:rounded-lg"
                     :src="courseImages[1].imageUrl"
                     alt=""
                     placeholder="/property-placeholder.svg"
                     @click="() => navigateTo(getCourseLink())"
                  />
                  <ImagePlaceholder
                     v-else
                     class="lg:rounded-lg"
                  />

                  <NuxtImg
                     v-if="courseImages[2]"
                     class="h-full w-full object-cover lg:rounded-lg"
                     :src="courseImages[2].imageUrl"
                     alt=""
                     placeholder="/property-placeholder.svg"
                     @click="() => navigateTo(getCourseLink())"
                  />
                  <ImagePlaceholder
                     v-else
                     class="lg:rounded-lg"
                  />
               </div>
            </div>
         </aside>

         <div class="flex-1 p-4 lg:p-0">
            <div class="flex flex-wrap gap-2 text-sm @container">
               <!--               <PropertyListItemFeatureItem -->
               <!--                  title="Bedrooms" -->
               <!--                  :icon="iconLibrary.course.bedroom" -->
               <!--               > -->
               <!--                  {{ course.rooms }} -->
               <!--               </PropertyListItemFeatureItem> -->

               <!--               <PropertyListItemFeatureItem -->
               <!--                  title="Bathrooms" -->
               <!--                  :icon="iconLibrary.course.bathroom" -->
               <!--               > -->
               <!--                  {{ course.bathrooms }} -->
               <!--               </PropertyListItemFeatureItem> -->

               <!--               <PropertyListItemFeatureItem -->
               <!--                  title="Floors" -->
               <!--                  :icon="iconLibrary.course.floors" -->
               <!--               > -->
               <!--                  {{ course.floors }} -->
               <!--               </PropertyListItemFeatureItem> -->

               <!--               <PropertyListItemFeatureItem -->
               <!--                  title="Car parking" -->
               <!--                  :icon="iconLibrary.course.carParking" -->
               <!--               > -->
               <!--                  {{ course.carParkingCapacity }} -->
               <!--               </PropertyListItemFeatureItem> -->

               <!--               <PropertyListItemFeatureItem -->
               <!--                  title="Bike parking" -->
               <!--                  :icon="iconLibrary.course.bikeParking" -->
               <!--               > -->
               <!--                  {{ course.bikeParkingCapacity }} -->
               <!--               </PropertyListItemFeatureItem> -->

               <!--               <PropertyListItemFeatureItem -->
               <!--                  title="Area" -->
               <!--                  :icon="iconLibrary.course.floorArea" -->
               <!--               > -->
               <!--                  {{ formatNumber(course.floorArea) }} sq.ft -->
               <!--               </PropertyListItemFeatureItem> -->
            </div>
         </div>
      </div>
      <!-- endregion: body -->
   </div>
</template>

<style scoped lang="postcss">
.feature-item {
   @apply flex shrink-0 items-center gap-1 rounded-lg bg-second-50 px-2 py-1;
}

.feature-item p {
   @apply text-sm text-second-600;
}

.feature-item .feature-item-icon {
   @apply text-second-500;
}

/* ----------------------------------- */
</style>
