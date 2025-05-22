<script setup lang="ts">
import { useApiGetCourseDetails } from '~~/__backend/courses/api';
import SingleCourseInfo from '~/page-components/teacher/courses/single/single-course-info.vue';

definePageMeta({
   middleware: ['auth-teacher'],
});

/* ---------------------------------------------------------------------------------------------- */

const route = useRoute();
const { id } = route.params;

const courseId = ref(Number(id) ?? 0);

const apiGetCourse = reactive(useApiGetCourseDetails(courseId));

onMounted(() => {
   apiGetCourse.execute();
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /app/teacher/courses/[id]
 * Description: View single course details
 */

watch(
   () => apiGetCourse.course,
   (course) => {
      useAppTitle(course?.description || 'Course');
   },
);

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <LoadingPlaceholder v-if="apiGetCourse.status === 'pending'" />

      <FullContainer v-if="apiGetCourse.course">
         <!-- region: Course info -->
         <SingleCourseInfo :course="apiGetCourse.course" />
         <!-- endregion: Course info -->

         <!-- region: Edit options -->
         <section>
            <div class="flex justify-center gap-3">
               <ButtonEdit
                  class="uppercase"
                  size="lg"
                  :to="`/app/teacher/courses/${courseId}/edit`"
               >
                  Edit course details
               </ButtonEdit>
            </div>
         </section>
         <!-- endregion: Edit options -->

         <UDivider class="my-5" />
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss">
.feature h3 {
   @apply text-sm uppercase text-second-500;
}

.feature p {
   @apply font-bold text-second-700;
}
</style>
