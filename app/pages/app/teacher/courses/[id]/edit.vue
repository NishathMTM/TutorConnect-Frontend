<script setup lang="ts">
import { useApiGetCourseDetails } from '~~/__backend/courses/api';
import EditCourseImages from '~/page-components/teacher/courses/edit/edit-course-images.vue';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-teacher'],
});

/* ---------------------------------------------------------------------------------------------- */

const { id } = useRoute().params;

const courseId = ref(Number(id) ?? 0);

const apiGetCourse = reactive(useApiGetCourseDetails(courseId));

apiGetCourse.execute();

/* ---------------------------------------------------------------------------------------------- */

/*
 * Path: /app/landlord/properties/[id]/edit
 * Description: Edit single course details
 */

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <FullContainer
         v-if="apiGetCourse.course"
         class="flex flex-col gap-10"
      >
         <EditCourseBasicInfo :course="apiGetCourse.course" />

         <EditCourseFeatures :course="apiGetCourse.course" />

         <EditCourseImages
            :course="apiGetCourse.course"
            property=""
            @complete="apiGetCourse.execute()"
         />
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
