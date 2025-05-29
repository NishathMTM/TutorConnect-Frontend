<script setup lang="ts">
import type { Course, CourseCategory } from '~~/__backend/courses/types';
import { watchDeep } from '@vueuse/shared';
import { z } from 'zod';
import { useApiGetAllCourseTypes } from '~~/__backend/courses/api';

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();
const showAddPropertyModal = ref(false);
const apiCourseTypes = reactive(useApiGetAllCourseTypes());
apiCourseTypes.execute();

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

watchDeep(courseCategory, (courseCategory) => {
   formState.courseCategoryId = courseCategory.id;
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <ButtonCreate
      @click="showAddPropertyModal = true"
   >
      Add new property
   </ButtonCreate>
   <!-- region: Modal -->
   <UModal
      v-model="showAddPropertyModal"
      prevent-close
   >
      <header class="flex justify-between p-5">
         <Heading2>Add new property</Heading2>

         <UButton
            icon="i-fluent:dismiss-24-regular"
            color="neutral"
            variant="soft"
            @click="showAddPropertyModal = false"
         />
      </header>
   </UModal>
</template>

      <style scoped lang="postcss">
         .form-section {
         @apply bg-white rounded-lg shadow-md p-6;
         }
      </style>
