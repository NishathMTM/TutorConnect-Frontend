import type { Course, CourseType } from '~~/__backend/courses/types';
import {
   CourseListSchema,
   CourseSchema,
   CourseTypeListSchema,
} from '~~/__backend/courses/types';
import { useApiFetch } from '~/composables/use-api-fetch';

/* ---------------------------------------------------------------------------------------------- */

export interface ApiGetAllCoursesByTeacherQuery {
   ownerId: number;
   courseCategoryId?: number;
   courseTypeId?: number;
   query?: string;
}

/**
 * Composable for API - Get all courses for a given teacher
 */
export function useApiGetAllCoursesByTeacher(query: ApiGetAllCoursesByTeacherQuery) {
   const { data, error, execute, status } = useApiFetch('/teacher/courses', {
      query,
   });

   const courseList = computed<Course[]>(() => {
      if (!error.value && data.value) {
         return CourseListSchema.parse(data?.value);
      }
      return [];
   });

   const errorStatusCode = computed(() => {
      if (error.value) {
         return error.value.statusCode;
      }
      return null;
   });

   return {
      courseList,
      error,
      execute,
      status,
      errorStatusCode,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Composable for API - Get all Course types
 */
export function useApiGetAllCourseTypes() {
   const { data, error, execute, status } = useApiFetch('/course/types');

   const courseTypeList = computed<CourseType[]>(() => {
      if (!error.value && data.value) {
         return CourseTypeListSchema.parse(data.value);
      }
      return [];
   });

   return {
      execute,
      status,
      courseTypeList,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Composable for API - Get single course details
 */
export function useApiGetCourseDetails(courseId: Ref<number | string>) {
   const { data, error, execute, status } = useApiFetch(
      () => `/course/${courseId.value}`,
   );

   const course = computed(() => {
      if (!error.value && data.value) {
         return CourseSchema.parse(data.value);
      }
      return null;
   });

   return {
      course,
      error,
      execute,
      status,
   };
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Update course details
 */
export interface UpdateCourseRequestBody {
   id: number;
   courseTypeId: number;
   courseCategoryId: number;
   description: string;
}

/* ---------------------------------------------------------------------------------------------- */
