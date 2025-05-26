<script setup lang="ts">
import type { Course } from '~~/__backend/courses/types';
import { useApiGetAllCourseListings } from '~~/__backend/course-listings/api';

/* ---------------------------------------------------------------------------------------------- */

const { course } = defineProps<{
   course: Course;
}>();

/* ---------------------------------------------------------------------------------------------- */

const courseId = ref(course.id);

const apiListings = reactive(useApiGetAllCourseListings(courseId));

// watchDeep(
//    () => property,
//    (property) => {
//       propertyId.value = property.id;
//       apiListings.execute();
//    },
//    {
//       immediate: true,
//    },
// );

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div>
      <!-- region: header -->
      <header class="mb-5">
         <Heading1 class="mb-5">
            Class listings
         </Heading1>

         <ButtonCreate :to="`/app/teacher/course-listings/${courseId}/add`">
            Add new class
         </ButtonCreate>
      </header>
      <!-- endregion: header -->

      <!-- region: all property listings -->
      <section v-if="true">
         <div class="flex flex-col gap-5">
            <!--            <CourseListingsTable -->
            <!--               :listings="apiListings.listings" -->
            <!--               @update:status="apiListings.execute()" -->
            <!--            /> -->
         </div>
      </section>

      <div v-else>
         <p class="italic text-second-300">
            There are no listings for this Class.
         </p>
      </div>

      <!-- endregion: all property listings -->
   </div>
</template>

<style scoped lang="postcss"></style>
