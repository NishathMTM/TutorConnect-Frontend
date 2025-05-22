<script setup lang="ts">
import type { Course, CourseCategory } from '~~/__backend/courses/types';
import { watchDeep } from '@vueuse/shared';
import { z } from 'zod';
import { useApiGetAllCourseTypes } from '~~/__backend/courses/api';
import InputCourseCategory from '~/components/course/input-course-category.vue';
import InputCourseType from '~/components/course/input-course-type.vue';
import AlertError from '~/components/ui/alert-error.vue';

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();

const apiCourseTypes = reactive(useApiGetAllCourseTypes());

onMounted(() => {
   apiCourseTypes.execute();
});

/* ---------------------------------------------------------------------------------------------- */

const toast = useToast();

/* ---------------------------------------------------------------------------------------------- */

const courseCategory = ref({} as CourseCategory);

const formSchema = z.object({
   courseTypeId: z.number().positive('Course type is required'),
   courseCategoryId: z.number().positive('Course category is required'),
});

const formState = reactive({
   ownerId: user.value?.id,
   courseTypeId: 0,
   courseCategoryId: 0,
   description: '',
});

const isSubmitting = ref(false);
const submitErrors = ref('');

async function handleCreateCourse() {
   submitErrors.value = '';
   isSubmitting.value = true;

   try {
      const response: Course = await useNuxtApp().$api('/course', {
         method: 'POST',
         body: formState,
      });

      toast.add({
         title: 'Success',
         description: 'Course created successfully',
         color: 'green',
      });

      return navigateTo(`/app/teacher/courses/`);
   }
   catch (error) {
      console.error(error);
      toast.add({
         title: 'Create course',
         description: 'Failed to create course',
         color: 'error',
      });
   }

   isSubmitting.value = false;
}

/* ---------------------------------------------------------------------------------------------- */

watchDeep(courseCategory, (courseCategory) => {
   formState.courseCategoryId = courseCategory.id;
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4 text-first-700">
         Add New Course
      </h2>

      <div class="text-second-400 mb-6">
         Add the basic course information and click "Create Course" to proceed to the details page.
      </div>

      <UForm
         class="flex flex-col gap-5"
         :schema="formSchema"
         :state="formState"
         @submit="handleCreateCourse()"
      >
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField
               label="Course Type"
               name="courseTypeId"
            >
               <InputCourseType v-model="formState.courseTypeId" />
            </UFormField>

            <UFormField
               label="Course Category"
               name="courseCategoryId"
            >
               <InputCourseCategory v-model="formState.courseCategoryId" />
            </UFormField>
            <UFormField
               label="Description"
               name="description"
            >
               <UTextarea v-model="formState.description" />
            </UFormField>
         </div>

         <!-- region: error messages -->
         <AlertError v-if="submitErrors">
            {{ submitErrors }}
         </AlertError>
         <!-- endregion: error messages -->

         <footer class="flex justify-end mt-4">
            <UButton
               color="primary"
               icon="i-fluent:add-24-regular"
               :loading="isSubmitting"
               type="submit"
            >
               Create Course
            </UButton>
         </footer>
      </UForm>
   </section>
</template>

<style scoped lang="postcss">
.form-section {
  @apply bg-white rounded-lg shadow-md p-6;
}
</style>
