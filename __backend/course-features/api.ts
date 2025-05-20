import type {
   PropertyFeature,
} from '~~/__backend/course-features/types';
import {
   PropertyFeatureListSchema,
} from '~~/__backend/course-features/types';

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get all the course features
 */
export function useApiGetAllPropertyFeatures() {
   const { data, error, execute, status } = useApiFetch('/property/features');

   const features = computed<PropertyFeature[]>(() => {
      if (!error.value && data.value) {
         return PropertyFeatureListSchema.parse(data.value);
      }
      return [];
   });

   return {
      execute,
      status,
      features,
      error,
   };
}

/* ---------------------------------------------------------------------------------------------- */
