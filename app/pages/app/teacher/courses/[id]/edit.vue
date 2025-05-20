<script setup lang="ts">
import { useApiGetCourseDetails } from '~~/__backend/courses/api';
import EditPropertyFeatures from '~/page-components/landlord/properties/edit/edit-course-features.vue';
import EditPropertyImages from '~/page-components/landlord/properties/edit/edit-course-images.vue';

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
         <EditPropertyBasicInfo :property="apiGetProperty.property" />

         <EditPropertyFeatures :property="apiGetProperty.property" />

         <EditPropertyImages
            :property="apiGetProperty.property"
            @complete="apiGetProperty.execute()"
         />
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
