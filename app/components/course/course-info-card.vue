<script setup lang="ts">
import type { Course } from '~~/__backend/courses/types';
import { iconLibrary } from '~/utils/icons-utils';

const { course } = defineProps<{
   course: Course;
}>();
</script>

<template>
   <section class="flex flex-col md:flex-row gap-5 border border-first-100 rounded-xl p-3">
      <!-- region: left -->
      <aside>
         <CourseInfoCardImages
            :images="course.courseImages"
         />
      </aside>
      <!-- endregion: left -->

      <!-- region: main -->
      <div class="flex-1 w-full">
         <!-- region: header -->
         <div class="mb-5">
            <div class="text-second-400 flex items-center gap-1">
               <UIcon :name="iconLibrary.property.propertyType" />
               {{ course.courseType.courseType }}
            </div>

            <div class="mt-2 flex items-center text-first-500 uppercase">
               <UIcon :name="iconLibrary.map" />
               <p>{{ course.courseCategory.courseCategory }}</p>
            </div>
         </div>
         <!-- endregion: header -->

         <!-- region: features -->
         <div class="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            <div
               v-for="feature in course.courseFeatures"
               :key="feature.id"
               class="rounded-md border border-first-50 bg-first-50/50 px-4 py-2"
            >
               <div class="leading-none text-sm">
                  {{ feature.feature }}
               </div>
            </div>
         </div>
         <!-- endregion: features -->
      </div>
      <!-- endregion: main -->
   </section>
</template>

<style scoped lang="postcss">
.feature-item {
   @apply flex items-center gap-1 rounded-lg bg-second-50 px-2 py-1 shrink-0;
}

.feature-item p {
   @apply text-sm  text-second-600;
}

.feature-item .feature-item-icon {
   @apply text-second-500;
}
</style>
