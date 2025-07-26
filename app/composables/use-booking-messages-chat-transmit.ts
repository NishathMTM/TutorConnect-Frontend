import type { CourseBookingMessage } from '~~/__backend/course-booking-message/types';
import { ref } from 'vue';
import { CourseBookingMessageSchema } from '~~/__backend/course-booking-message/types';

export function useBookingMessagesChatTransmit(bookingId: Ref<number>) {
   const messages = ref<CourseBookingMessage[]>([]);

   const { $transmit } = useNuxtApp();

   const channel = computed(() => {
      return `booking/${bookingId.value}/message`;
   });

   const subscription = $transmit.subscription(channel.value);

   async function createSubscription() {
      await subscription.create();
   }

   subscription.onMessage((data: { message: unknown }) => {
      messages.value.push(CourseBookingMessageSchema.parse(data.message));
   });

   return {
      createSubscription,
      messages,
   };
}
