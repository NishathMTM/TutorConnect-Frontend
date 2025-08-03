import type { Ref } from 'vue';
import type {
   AdminStudent,
   AdminTeacher,
   CourseListingsStats,
   UserStats,
} from '~~/__backend/_admin/types';

import type { PaginatedResponse } from '~~/__backend/types';

import { computed } from 'vue';
import {
   CourseListingsStatsSchema,
   UserStatsSchema,
} from '~~/__backend/_admin/types';

import { useApiPagination } from '~~/__backend/use-api-pagination';

/* --------------------------------------------------------------s-------------------------------- */

/**
 * Get user statistics summary
 */
export function useAdminApiGetUserStats() {
   const { data, error, execute, status } = useApiFetch('/admin/users/summary');

   const stats = computed<UserStats | null>(() => {
      if (!error.value && data.value) {
         try {
            return UserStatsSchema.parse(data.value);
         }
         catch (parseError) {
            console.error('Failed to parse user stats:', parseError);
            return null;
         }
      }
      return null;
   });

   return {
      execute,
      status,
      stats,
      error,
   };
}

/* ---------------------------------------------------------------------------------------------- */
export function useAdminApiGetCourseListingsStats() {
   const { data, error, execute, status } = useApiFetch('/admin/course-listings-summary');

   const stats = computed<CourseListingsStats | null>(() => {
      if (!error.value && data.value) {
         try {
            return CourseListingsStatsSchema.parse(data.value);
         }
         catch (parseError) {
            console.error('Failed to parse course listings stats:', parseError);
            return null;
         }
      }
      return null;
   });

   return {
      execute,
      status,
      stats,
      error,
   };
}
/* ---------------------------------------------------------------------------------- */

/**
 * Get all teachers with pagination
 */
export function useApiGetTeachers(query: { page: number; perPage: number }) {
   const { data, error, execute, status } = useApiFetch<PaginatedResponse>('/admin/teachers', {
      query: computed(() => ({
         page: query.page,
         per_page: query.perPage,
      })),
   });

   const teachers = computed<AdminTeacher[]>(() => {
      if (!error.value && data.value) {
         return data.value.data || [];
      }
      return [];
   });

   const { pagination } = useApiPagination(data, error);

   return {
      execute,
      teachers,
      pagination,
      error,
      status,
   };
}

/* --------------------------------------------------------------------------------------------- */
/**
 *Get all students
 */
export function useApiGetStudents(query: { page: number; perPage: number }) {
   const { data, error, execute } = useApiFetch<PaginatedResponse>('/admin/students', {
      query: {
         page: query.page,
         per_page: query.perPage,
      },
   });

   const students = computed<AdminStudent[]>(() => {
      if (!error.value && data.value) {
         return data.value.data;
      }
      return [];
   });

   const { pagination } = useApiPagination(data, error);

   return {
      execute,
      students,
      pagination,
      error,
      status,
   };
}
/* ---------------------------------------------------------------------------------------------- */

/**
 * Get teacher by ID
 */
export function useApiGetTeacherById(teacherId: Ref<number>) {
   const { data, error, execute, status } = useApiFetch<AdminTeacher>(
      () => `/admin/teacher/${teacherId.value}`,
   );

   const teacher = computed(() => {
      if (!error.value && data.value) {
         return data.value;
      }
      return null;
   });

   return {
      teacher,
      error,
      execute,
      status,
   };
}
