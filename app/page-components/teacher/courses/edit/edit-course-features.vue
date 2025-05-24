<script setup lang="ts">
import type { CourseFeature } from '~~/__backend/course-features/types';
import type { Course } from '~~/__backend/courses/types';
import SelectCourseFeatures
   from '~/page-components/teacher/courses/edit/select-course-features.vue';

/* ---------------------------------------------------------------------------------------------- */

const { course } = defineProps<{
   course: Course;
}>();

/* ---------------------------------------------------------------------------------------------- */

const selectedFeatures = ref<CourseFeature[]>(course.courseFeatures);

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section>
      <header class="mb-5">
         <Heading1>Course features</Heading1>
      </header>

      <!-- region: features -->
      <section>
         <SelectCourseFeatures
            v-model="selectedFeatures"
            :course-id="course.id"
         />
      </section>

      <!-- endregion: features -->
   </section>
</template>

<style scoped lang="postcss"></style>
