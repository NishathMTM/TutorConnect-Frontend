import type { PublicCourseListing } from '~~/__backend/public/types';

import type { PaginatedResponse } from '~~/__backend/types';
import { PublicCourseListingListSchema, PublicCourseListingSchema } from '~~/__backend/public/types';

import { useApiPagination } from '~~/__backend/use-api-pagination';
import { useApiFetch } from '~/composables/use-api-fetch';

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get all public course listings
 */
export interface PublicGetActiveCoursesQuery {
   page: number;
   perPage: number;
   courseCategoryId?: number;
   courseTypeId?: number;
   minHourlyRate?: number;
   maxHourlyRate?: number;
}
export function usePublicApiGetActiveCourses(query: PublicGetActiveCoursesQuery) {
   const { data, error, execute, status } = useApiFetch<PaginatedResponse>(
      `/public/course-listing`,
      {
         query,
      },
   );

   const listings = computed<PublicCourseListing[]>(() => {
      if (!error.value && data.value) {
         return PublicCourseListingListSchema.parse(data.value.data);
      }
      return [];
   });

   const { pagination } = useApiPagination(data, error);

   return {
      pagination,
      listings,
      error,
      status,
      execute,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get single public course listing
 */

export function usePublicApiGetCourseListing(listingId: Ref<number>) {
   const { data, error, execute, status } = useApiFetch<PaginatedResponse>(
      () => `/public/course-listing/${listingId.value}`,
   );

   const listing = computed<PublicCourseListing | null>(() => {
      if (!error.value && data.value) {
         return PublicCourseListingSchema.parse(data.value);
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
