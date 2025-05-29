<script setup lang="ts">
import type { PublicCourseInfo } from '~~/__backend/public/types';
import CourseOverviewItem from '~/components/course/course-overview-item.vue';
import { iconLibrary } from '~/utils/icons-utils';

/* ---------------------------------------------------------------------------------------------- */

const { course } = defineProps<{
   course: PublicCourseInfo;
}>();
</script>

<template>
   <div class="flex flex-col gap-10">
      <section id="property-overview">
         <header class="section-header">
            Class Overview
         </header>

         <div class="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-5">
            <CourseOverviewItem
               title="Class type"
               :icon="iconLibrary.property.propertyType"
            >
               {{ course.courseType.courseType }}
            </CourseOverviewItem>
         </div>
      </section>

      <section>
         <header class="section-header">
            Class Features
         </header>

         <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <div
               v-for="feature in course.courseFeatures"
               :key="feature.id"
               class="rounded-md border border-first-50 bg-first-50/50 px-4 py-2"
            >
               <div class="leading-none">
                  {{ feature.feature }}
               </div>
            </div>
         </div>

         <div v-if="course.courseFeatures.length === 0">
            No features found.
         </div>
      </section>
   </div>
</template>

<style scoped lang="postcss">
.icon-wrapper {
   @apply flex size-8 items-center justify-center rounded-full bg-first-600 p-1;
   @apply text-white;
}

.section-header {
   @apply mb-2 text-xl font-bold text-second-600;
}
</style>
