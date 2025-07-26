import type { Booking } from '~~/__backend/course-bookings/types';
import { CourseBookingMessageTagEnum } from '~~/__backend/course-booking-message/types';

/* ---------------------------------------------------------------------------------------------- */

/**
 * Composable for handling course booking computations
 */
export function useCourseBookingMessaging(booking: Ref<Booking | null>) {
   /**
    * Post a message to the booking
    */
   async function postBookingMessage(
      message: string,
      tag: CourseBookingMessageTagEnum = CourseBookingMessageTagEnum.EMPTY,
   ) {
      if (!booking.value)
         return;

      const { user } = useUserSession();

      const messageBody = reactive({
         bookingId: booking.value.id,
         senderId: user.value?.id,
         message,
         tag,
      });

      try {
         await useNuxtApp().$api('/course-booking-message', {
            method: 'POST',
            body: messageBody,
         });
      }
      catch (error) {
         console.error(error);
      }
   }

   return {
      postBookingMessage,
   };
}
