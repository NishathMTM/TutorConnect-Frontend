import type {
   CourseBookingMessage,
} from '~~/__backend/course-booking-message/types';
import type { PaginatedResponse } from '~~/__backend/types';
import {
   CourseBookingMessageListSchema,
} from '~~/__backend/course-booking-message/types';

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get all messages for the booking
 */
export function useApiGetBookingMessages(bookingId: Ref<number>) {
   const { data, error, execute, status } = useApiFetch<PaginatedResponse>(
      () => `/course-booking-message/booking/${bookingId.value}`,
   );

   const messages = computed<CourseBookingMessage[]>(() => {
      if (!error.value && data.value) {
         return CourseBookingMessageListSchema.parse(data.value);
      }
      return [];
   });

   return {
      messages,
      status,
      error,
      execute,
   };
}

/* ---------------------------------------------------------------------------------------------- */
