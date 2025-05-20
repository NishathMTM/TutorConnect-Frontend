import type { PropertyVisitMessage } from '~~/__backend/course-visit-messages/types';
import { ref } from 'vue';
import { PropertyVisitMessageSchema } from '~~/__backend/course-visit-messages/types';

export function useVisitMessagesChatTransmit(visitId: Ref<number>) {
   const messages = ref<PropertyVisitMessage[]>([]);

   const { $transmit } = useNuxtApp();

   const channel = computed(() => {
      return `visit/${visitId.value}/message`;
   });

   const subscription = $transmit.subscription(channel.value);

   async function createSubscription() {
      await subscription.create();
   }

   subscription.onMessage((data: { message: unknown }) => {
      messages.value.push(PropertyVisitMessageSchema.parse(data.message));
   });

   return {
      createSubscription,
      messages,
   };
}
