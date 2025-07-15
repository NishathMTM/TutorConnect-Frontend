<script setup lang="ts">
import type { ApiGetAllCoursesByTeacherQuery } from '~~/__backend/courses/api';
import {

   useApiGetAllCoursesByTeacher,
} from '~~/__backend/courses/api';
import LoadingPlaceholder from '~/components/ui/loading-placeholder.vue';
import CourseListItem from '~/page-components/teacher/courses/course-list-item.vue';
import CoursesHeader from '~/page-components/teacher/courses/courses-header.vue';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-teacher'],
});

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();

const queryParams = reactive({
   ownerId: user.value?.id,
   courseCategoryId: undefined,
   courseTypeId: undefined,
   query: '',
} as ApiGetAllCoursesByTeacherQuery);

const apiFetchCourses = reactive(useApiGetAllCoursesByTeacher(queryParams));

apiFetchCourses.execute();

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /app/teacher/classes
 * Description: Teacher's classes
 */

useHead({
   title: 'Teacher\'s Courses',
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <FullContainer>
         <!-- region: header -->
         <CoursesHeader v-model:query="queryParams" />

         <!-- endregion: header -->

         <!-- region: List of properties -->
         <section class="mt-10">
            <div
               v-if="apiFetchCourses.status === 'pending'"
               class="mb-10"
            >
               <LoadingPlaceholder />
            </div>

            <div v-if="apiFetchCourses.errorStatusCode === 404">
               No courses matched
            </div>

            <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
               <div
                  v-for="course in apiFetchCourses.courseList"
                  :key="course.id"
               >
                  <CourseListItem :course="course" />
               </div>
            </div>
         </section>
         <!-- endregion: List of classes -->
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
