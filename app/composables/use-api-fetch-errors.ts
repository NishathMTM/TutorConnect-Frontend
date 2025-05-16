import type { FetchError } from 'ofetch';
import type { Ref } from 'vue';

/**
 * Handles error from api fetch requests
 */
export function useApiFetchErrors(err: Ref<FetchError | undefined>) {
   const errorCode = computed(() => {
      if (err.value) {
         return err.value.statusCode;
      }
      return null;
   });

   return {
      errorCode,
   };
}
