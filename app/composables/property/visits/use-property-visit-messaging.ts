import type { Visit } from '~~/__backend/property-visits/types';
import { PropertyVisitMessageTagEnum } from '~~/__backend/property-visit-messages/types';

/* ---------------------------------------------------------------------------------------------- */

/**
 * Composable for handling property visit computations
 */
export function usePropertyVisitMessaging(visit: Ref<Visit | null>) {
   /**
    * Post a message to the visit
    */
   async function postVisitMessage(
      message: string,
      tag: PropertyVisitMessageTagEnum = PropertyVisitMessageTagEnum.EMPTY,
   ) {
      if (!visit.value)
         return;

      const { user } = useUserSession();

      const messageBody = reactive({
         visitId: visit.value.id,
         senderId: user.value?.id,
         message,
         tag,
      });

      try {
         await useNuxtApp().$api('/property-visit-message', {
            method: 'POST',
            body: messageBody,
         });
      }
      catch (error) {
         console.error(error);
      }
   }

   return {
      postVisitMessage,
   };
}
