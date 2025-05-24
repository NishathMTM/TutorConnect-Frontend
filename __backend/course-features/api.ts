/* ---------------------------------------------------------------------------------------------- */

import type { CourseFeature } from '~~/__backend/course-features/types';
import { CourseFeatureListSchema } from '~~/__backend/course-features/types';

/**
 * Get all the course features
 */
export function useApiGetAllCourseFeatures() {
   const { data, error, execute, status } = useApiFetch('/course/features');

   const features = computed<CourseFeature[]>(() => {
      if (!error.value && data.value) {
         return CourseFeatureListSchema.parse(data.value);
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
