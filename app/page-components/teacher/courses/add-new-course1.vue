<script setup lang="ts">
import type { Course, CourseCategory } from '~~/__backend/courses/types';
import { watchDeep } from '@vueuse/shared';
import { z } from 'zod';
import { useApiGetAllCourseTypes } from '~~/__backend/courses/api';
import InputCourseType from '~/components/course/input-course-type.vue';

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();

const showAddCourseModal = ref(false);

const apiCourseTypes = reactive(useApiGetAllCourseTypes());

apiCourseTypes.execute();

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
});

const isSubmitting = ref(false);
const submitErrors = ref('');

async function handleCreateCourse() {
   submitErrors.value = '';

   try {
      const response: Course = await useNuxtApp().$api('/course', {
         method: 'POST',
         body: formState,
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
      @click="showAddCourseModal = true"
   >
      Add new course
   </ButtonCreate>

   <!-- region: Modal -->
   <UModal
      v-model="showAddCourseModal"
      prevent-close
   >
      <header class="flex justify-between p-5">
         <Heading2>Add new course</Heading2>

         <UButton
            icon="i-fluent:dismiss-24-regular"
            color="neutral"
            variant="soft"
            @click="showAddCourseModal = false"
         />
      </header>

      <div class="mb-5 px-5">
         <div class="text-second-400">
            Add the basic course information and in the next page, you can add more details.
         </div>
      </div>

      <section class="p-5 pt-0">
         <UForm
            class="flex flex-col gap-5"
            :schema="formSchema"
            :state="formState"
            @submit="handleCreateCourse()"
         >
            <div class="grid grid-cols-2 gap-3">
               <UFormField
                  label="CourseType"
                  name="courseTypeId"
               >
                  <InputCourseType v-model="formState.courseTypeId" />
               </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-3">
               <UFormField
                  label="Course Category"
                  name="courseCategoryId"
               >
                  <InputCourseCategory v-model="formState.courseCategoryId" />
               </UFormField>

               <!-- region: error messages -->
               <AlertError v-if="submitErrors">
                  {{ submitErrors }}
               </AlertError>
               <!-- endregion: error messages -->

               <footer class="flex justify-end">
                  <UButton
                     icon="i-fluent:arrow-right-24-regular"
                     :loading="isSubmitting"
                     type="submit"
                  >
                     Next
                  </UButton>
               </footer>
            </div>
         </UForm>
      </section>
   </UModal>
   <!-- endregion: Modal -->
</template>

<style scoped lang="postcss"></style>
