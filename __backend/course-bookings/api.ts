import type { Booking, BookingFull, CourseBookingStatus } from '~~/__backend/course-bookings/types';
import type { PaginatedResponse } from '~~/__backend/types';
import {
   BookingFullListSchema,
   BookingFullSchema,
   BookingSchema,
} from '~~/__backend/course-bookings/types';
import { useApiPagination } from '~~/__backend/use-api-pagination';
import { useApiFetchErrors } from '~/composables/use-api-fetch-errors';

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get the bookings detail for the listing by user
 */
export function useApiGetListingBookingForUser(listingId: Ref<number>) {
   const { data, error, execute, status } = useApiFetch(
      () => `/course-booking/listing/${listingId.value}`,
   );

   const booking = computed<Booking | null>(() => {
      if (!error.value && data.value) {
         return BookingSchema.parse(data.value);
      }
      return null;
   });

   return {
      booking,
      error,
      execute,
      status,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get all bookings details for the user
 */
export function useApiGetBookingsForUser(query: ApiGetAllBookingsForTeacherQuery) {
   const { data, error, execute, status } = useApiFetch<PaginatedResponse>(`/course-booking/user/`, {
      query,
   });

   const bookings = computed<BookingFull[]>(() => {
      if (!error.value && data.value) {
         return BookingFullListSchema.parse(data.value.data);
      }
      return [];
   });

   const { pagination } = useApiPagination(data, error);

   return {
      pagination,
      bookings,
      error,
      execute,
      status,
   };
}

/* ---------------------------------------------------------------------------------------------- */

export interface ApiGetAllBookingsForTeacherQuery {
   page: number;
   perPage: number;
   status?: CourseBookingStatus;
   archived: boolean;
}

/**
 * Get all bookings for the teacher
 */
export function useApiGetAllBookingsForTeacher(
   query: ApiGetAllBookingsForTeacherQuery,
   teacherId: Ref<number>,
) {
   const { data, error, execute, status } = useApiFetch<PaginatedResponse>(
      () => `/course-booking/teacher/${teacherId.value}`,
      {
         query,
      },
   );

   const bookings = computed<BookingFull[]>(() => {
      if (!error.value && data.value) {
         return BookingFullListSchema.parse(data.value.data);
      }
      return [];
   });

   const { pagination } = useApiPagination(data, error);

   return {
      pagination,
      bookings,
      error,
      execute,
      status,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get single booking details
 */
export function useApiGetSingleBookingInfo(visitId: Ref<number>) {
   const { data, error, execute, status } = useApiFetch<PaginatedResponse>(
      () => `/course-booking/${visitId.value}`,
   );

   const booking = computed<BookingFull | null>(() => {
      if (!error.value && data.value) {
         return BookingFullSchema.parse(data.value);
      }
      return null;
   });

   const { errorCode } = useApiFetchErrors(error);

   return {
      booking,
      error,
      errorCode,
      execute,
      status,
   };
}
