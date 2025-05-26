import type { CourseListing } from '~~/__backend/course-listings/types';
import { CourseListingListSchema, CourseListingSchema } from '~~/__backend/course-listings/types';

import { useApiFetch } from '~/composables/use-api-fetch';

/**
 * API - Get all the listing under a given property
 */
export function useApiGetAllCourseListings(courseId: Ref<number>) {
   const { data, error, execute, status } = useApiFetch(
      () => `/course-listing/by-teacher/${courseId.value}`,
      {
         immediate: true,
      },
   );

   const listings = computed<CourseListing[]>(() => {
      if (!error.value && data.value) {
         return CourseListingListSchema.parse(data.value);
      }

      return [];
   });

   return {
      data,
      listings,
      error,
      execute,
      status,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * API = Get all the listings for the teacher
 */
export function useApiGetAllCourseListingsByTeacher(teacherId: Ref<number>) {
   const { data, error, execute, status } = useApiFetch(
      () => `/course-listing/by-teacher/${teacherId.value}`,
      {
         immediate: true,
      },
   );

   const listings = computed<CourseListing[]>(() => {
      if (!error.value && data.value) {
         return CourseListingListSchema.parse(data.value);
      }

      return [];
   });

   return {
      data,
      listings,
      error,
      execute,
      status,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * API - Get single listing details
 */
export function useApiGetCourseListing(id: Ref<number>) {
   const { data, error, execute, status } = useApiFetch(`/course-listing/${id.value}`);

   const listing = computed<CourseListing | null>(() => {
      if (!error.value && data.value) {
         return CourseListingSchema.parse(data.value);
      }
      return null;
   });

   return {
      listing,
      error,
      status,
      execute,
   };
}
