<script setup lang="ts">
import type { Course } from '~~/__backend/courses/types';
import { z } from 'zod';
import { useApiGetAllCourseTypes } from '~~/__backend/courses/api';

/* ---------------------------------------------------------------------------------------------- */

const { course } = defineProps<{
   course: Course;
}>();

const toast = useToast();

/* ---------------------------------------------------------------------------------------------- */

const apiCourseTypes = reactive(useApiGetAllCourseTypes());
apiCourseTypes.execute();

/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */

const courseCategory = ref(course.courseCategory);

const formSchema = z.object({
   description: z.string().min(20, 'Description is required'),
});

const formState = reactive({
   id: course.id,
   CourseTypeId: course.courseTypeId,
   courseCategoryId: course.courseCategoryId,
   description: course.description ?? '',
});

watch(courseCategory, (courseCategory) => {
   formState.courseCategoryId = courseCategory.id;
});

const submitDisabled = ref(false);

const submitErrors = ref('');
const isSubmitting = ref(false);

/**
 * Handles the form submit
 */
async function handleSubmit() {
   isSubmitting.value = true;
   submitErrors.value = '';
   submitDisabled.value = true;

   try {
      await useNuxtApp().$api('/course', {
         method: 'PUT',
         body: {
            ...formState,
         },
      });

      toast.add({
         title: 'Updated',
         description: 'Course details are saved',
         color: 'success',
         callback: () => {
            submitDisabled.value = false;
         },
      });

      return navigateTo(`/app/teacher/courses/${course.id}`);
   }
   catch (error) {
      console.error(error);
      submitErrors.value = 'Failed to save the details';
   }

   isSubmitting.value = false;
   submitDisabled.value = false;
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section>
      <header class="mb-5">
         <Heading1>Course information</Heading1>
      </header>

      <div class="p-6 rounded-xl border border-first-100 bg-first-50/20">
         <UForm
            class="flex flex-col gap-6"
            :state="formState"
            :schema="formSchema"
            @submit="handleSubmit()"
         >
            <!-- Course Type and Category in two columns -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <!-- Course Type -->
               <UFormField
                  label="Course Type"
                  name="courseTypeId"
               >
                  <USelectMenu
                     v-model="formState.CourseTypeId"
                     :options="apiCourseTypes.courseTypeList"
                     option-attribute="courseType"
                     value-attribute="id"
                     class="w-full"
                     placeholder="Select course type"
                  />
               </UFormField>

               <!-- Course Category -->
               <UFormField
                  label="Course Category"
                  name="courseCategoryId"
                  help="Select the appropriate category for your course"
               >
                  <InputCourseCategory
                     v-model="formState.courseCategoryId"
                     @select="(payload) => (courseCategory = payload)"
                  />
               </UFormField>
            </div>

            <!-- Description in full width -->
            <UFormField
               label="Course Description"
               name="description"
               help="Provide a detailed description of your course (minimum 20 characters)"
            >
               <UTextarea
                  v-model="formState.description"
                  :rows="8"
                  resize
                  class="w-full"
                  placeholder="Enter your course description here..."
               />
            </UFormField>

            <!-- Error message -->
            <AlertError v-if="submitErrors">
               {{ submitErrors }}
            </AlertError>

            <!-- Action buttons -->
            <div class="flex justify-center gap-4 mt-2">
               <ButtonUpdate
                  type="submit"
                  :loading="isSubmitting"
                  :disabled="submitDisabled"
               >
                  Update details
               </ButtonUpdate>
               <ButtonCancel
                  color="gray"
                  :to="`/app/teacher/courses/${course.id}`"
               />
            </div>
         </UForm>
      </div>
   </section>
</template>

<style scoped lang="postcss"></style>
