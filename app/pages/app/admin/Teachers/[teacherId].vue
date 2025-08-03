<script setup lang="ts">
import { useApiGetTeacherById } from '~~/__backend/_admin/api';
import { useApiGetAllCoursesByTeacher } from '~~/__backend/courses/api';

definePageMeta({
   middleware: ['auth-admin'],
});

const route = useRoute();
const teacherId = computed(() => Number(route.params.teacherId));

// Fetch teacher details
const apiTeacher = reactive(useApiGetTeacherById(teacherId));
await apiTeacher.execute();

// Fetch teacher's courses
const queryParams = reactive({
   ownerId: teacherId,
});

const apiCourses = reactive(useApiGetAllCoursesByTeacher(queryParams));
await apiCourses.execute();

// Set page title
useAppTitle('Teacher Details');
</script>

<template>
   <AdminLayout>
      <FullContainer>
         <LoadingPlaceholder v-if="apiTeacher.status === 'pending'" />

         <template v-else-if="apiTeacher.teacher">
            <!-- Landlord Details -->
            <PageHeader class="mb-8">
               <div class="flex items-center justify-between">
                  <div>
                     <Heading2 class="mb-2">
                        {{ apiTeacher.teacher.profile.fullName }}
                     </Heading2>
                     <div class="space-y-2 text-second-500">
                        <p>Email: {{ apiTeacher.teacher.email }}</p>
                        <p>Phone: {{ apiTeacher.teacher.profile.phone1 }}</p>
                        <p>Address: {{ apiTeacher.teacher.profile.address }}</p>
                     </div>
                  </div>
               </div>
            </PageHeader>

            <!-- Courses Section -->
            <section>
               <div class="flex items-center justify-between mb-4">
                  <Heading3>Courses</Heading3>
                  <p class="text-second-500">
                     Total: {{ apiCourses.courseList.length }}
                  </p>
               </div>

               <LoadingPlaceholder v-if="apiCourses.status === 'pending'" />

               <div
                  v-else-if="apiCourses.courseList.length > 0"
                  class="grid grid-cols-1 gap-5 lg:grid-cols-2"
               >
                  <div
                     v-for="course in apiCourses.courseList"
                     :key="course.id"
                  >
                     <CourseListItem
                        :course="course"
                     />
                  </div>
               </div>

               <div
                  v-else
                  class="text-center text-second-500 py-10"
               >
                  No Courses found for this teacher
               </div>
            </section>
         </template>

         <template v-else-if="apiTeacher.error">
            <div class="text-center text-red-500 py-10">
               Failed to load teacher details
            </div>
         </template>
      </FullContainer>
   </AdminLayout>
</template>

<style scoped lang="postcss">
</style>
