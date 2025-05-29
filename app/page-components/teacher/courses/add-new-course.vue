<script setup lang="ts">
import type { Course, CourseCategory, CourseType } from '~~/__backend/courses/types';
import { watchDeep } from '@vueuse/shared';
import { z } from 'zod';
import { useApiGetAllCourseTypes } from '~~/__backend/courses/api';

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();
const showAddCourseModal = ref(false);
const apiCourseTypes = reactive(useApiGetAllCourseTypes());
apiCourseTypes.execute();

onMounted(() => {
   apiCourseTypes.execute();
});

/* ---------------------------------------------------------------------------------------------- */

const toast = useToast();

/* ---------------------------------------------------------------------------------------------- */

const courseType = ref({} as CourseType);
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
         color: 'success',
      });

      return navigateTo(`/app/teacher/courses/${response.id}/edit`);
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

watchDeep(courseType, (courseType) => {
   formState.courseTypeId = courseType.id;
});

watchDeep(courseCategory, (courseCategory) => {
   formState.courseCategoryId = courseCategory.id;
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <!-- region: Modal -->
   <UModal
      v-model="showAddCourseModal"
      prevent-close
      title="Add New Class"
      :ui="{ width: 'sm:max-w-md md:max-w-lg' }"
   >
      <UButton
         icon="i-heroicons-plus"
         label="Add New Class"
         color="primary"
         size="md"
         class="mb-4"
         @click="showAddCourseModal = true"
      />

      <template #body>
         <div class="mb-4 px-1">
            <p class="text-gray-600 text-sm">
               Fill in the details below to create a new class. All fields are required.
            </p>
         </div>
         <UForm :schema="formSchema" :state="formState" class="space-y-6">
            <div class="grid gap-6">
               <UFormField name="courseTypeId" class="form-field">
                  <template #label>
                     <div class="flex items-center gap-1 mb-1">
                        <UIcon name="i-heroicons-academic-cap" class="text-primary-500" />
                        <span>Course Type</span>
                     </div>
                  </template>
                  <InputCourseType v-model="formState.courseTypeId" @select="courseType = $event" />
               </UFormField>

               <UFormField name="courseCategoryId" class="form-field">
                  <template #label>
                     <div class="flex items-center gap-1 mb-1">
                        <UIcon name="i-heroicons-tag" class="text-primary-500" />
                        <span>Course Category</span>
                     </div>
                  </template>
                  <InputCourseCategory v-model="formState.courseCategoryId" @select="courseCategory = $event" />
               </UFormField>

               <UFormField name="description" class="form-field">
                  <template #label>
                     <div class="flex items-center gap-1 mb-1">
                        <UIcon name="i-heroicons-document-text" class="text-primary-500" />
                        <span>Description</span>
                     </div>
                  </template>
                  <UTextarea
                     v-model="formState.description"
                     placeholder="Enter course description"
                     rows="4"
                     class="w-full"
                  />
               </UFormField>
            </div>

            <div v-if="submitErrors" class="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-md">
               {{ submitErrors }}
            </div>
         </UForm>
      </template>

      <template #footer>
         <div class="flex justify-end gap-3 pt-2">
            <UButton
               color="gray"
               variant="ghost"
               size="md"
               icon="i-heroicons-x-mark"
               @click="showAddCourseModal = false"
            >
               Cancel
            </UButton>
            <UButton
               color="primary"
               variant="solid"
               size="md"
               icon="i-heroicons-check"
               :loading="isSubmitting"
               @click="handleCreateCourse"
            >
               Create Course
            </UButton>
         </div>
      </template>
   </UModal>
</template>

<style scoped lang="postcss">
.form-section {
   @apply bg-white rounded-lg shadow-md p-6;
}

.form-field {
   @apply transition-all duration-200;
}

.form-field:hover {
   @apply transform scale-[1.01];
}
</style>
