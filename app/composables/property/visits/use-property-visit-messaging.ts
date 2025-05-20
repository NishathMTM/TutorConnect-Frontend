import type { Visit } from '~~/__backend/course-visits/types';
import { PropertyVisitMessageTagEnum } from '~~/__backend/course-visit-messages/types';

/* ---------------------------------------------------------------------------------------------- */

/**
 * Composable for handling course visit computations
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
         await useNuxtApp().$api('/course-visit-message', {
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
