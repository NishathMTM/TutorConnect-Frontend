<script setup lang="ts">
// import PropertyListings from '~/page-components/landlord/properties/listings/course-listings.vue';

/* ---------------------------------------------------------------------------------------------- */

import { useApiGetCourseDetails } from '~~/__backend/courses/api';
import SingleCourseInfo from '~/page-components/teacher/courses/single/single-course-info.vue';

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
 * Path: /app/landlord/properties/[id]
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
         <!-- region: Property info -->
         <SingleCourseInfo :property="apiGetCourse.course" />
         <!-- endregion: Property info -->

         <!-- region: Edit options -->
         <section>
            <div class="flex justify-center gap-3">
               <ButtonEdit
                  class="uppercase"
                  size="lg"
                  to="/app/need/to/add"
               >
                  Edit property details
               </ButtonEdit>
            </div>
         </section>
         <!-- endregion: Edit options -->

         <UDivider class="my-5" />

         <!--         &lt;!&ndash; region: Property listing details &ndash;&gt; -->
         <!--         <PropertyListings :property="apiGetProperty.property" /> -->
         <!-- endregion: Property listing details -->
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
