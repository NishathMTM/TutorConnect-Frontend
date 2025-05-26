<script setup lang="ts">
import { useApiGetCourseListing } from '~~/__backend/course-listings/api';
import { useApiGetCourseDetails } from '~~/__backend/courses/api';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-teacher'],
});

/* ---------------------------------------------------------------------------------------------- */

const { listingId } = useRoute().params;

const listingIdRef = ref(Number(listingId));
const courseIdRef = ref(0);

/* ---------------------------------------------------------------------------------------------- */

const apiListing = reactive(useApiGetCourseListing(listingIdRef));
apiListing.execute();

/* ---------------------------------------------------------------------------------------------- */

const apiCourse = reactive(useApiGetCourseDetails(courseIdRef));

watch(() => apiListing.listing, (listing) => {
   if (listing) {
      courseIdRef.value = listing.courseId;
      apiCourse.execute();
   }
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /app/teacher/course-listings/[listingId]
 * Description: View single course listing details
 */

useAppTitle('Listing details');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <div v-if="apiListing.status === 'pending'">
         <LoadingPlaceholder />
      </div>

      <div v-if="apiListing.listing">
         <!-- region: Listing details -->
         <section>
            <CourseListingCard :listing="apiListing.listing" />
         </section>
         <!-- endregion: Listing details -->

         <!-- region: Listing message -->
         <section />
         <!-- endregion: Listing message -->
      </div>

      <USeparator horizontal class="my-10 uppercase" label="Course details" />

      <div v-if="apiCourse.course">
         <SingleCourseInfo :course="apiCourse.course" />
      </div>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
