<script setup lang="ts">
import type { CourseListing } from '~~/__backend/course-listings/types';
import { z } from 'zod';
import { useApiGetCourseDetails } from '~~/__backend/courses/api';
import { todayAsString } from '~/utils/datetime-utils';

/* ---------------------------------------------------------------------------------------------- */
definePageMeta({
   middleware: ['auth-teacher'],
});

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();
const toast = useToast();

const { courseId } = useRoute().params;

const apiCourse = reactive(useApiGetCourseDetails(ref(Number(courseId))));
await apiCourse.execute();

/* ---------------------------------------------------------------------------------------------- */

const formSchema = z.object({
   courseId: z.number(),
   teacherId: z.number(),
   title: z.string().min(3, 'Title is required').max(255),
   description: z.string().optional(),
   listingDate: z.string().date(),
   availableFrom: z.string().date(),
   hourlyRate: z.coerce.number().positive('Should be a valid amount'),
   contactPhone: z.string().min(10, 'Phone number is required'),
   contactAddress: z.string().min(1, 'Address is required'),
   contactEmail: z.string().min(1, 'Email is required'),
});

const formState = reactive({
   courseId: Number(courseId),
   teacherId: Number(user.value?.id),
   title: '',
   listingDate: todayAsString(),
   availableFrom: todayAsString(),
   description: '',
   hourlyRate: '' as unknown as number,
   contactPhone: '077-1234-123',
   contactAddress: 'Some address\nLine1\nLine2',
   contactEmail: 'hello@hello.com',
});

const isSubmitting = ref(false);
const submitErrors = ref('');
const errors = reactive({
   title: '',
   description: '',
   listingDate: '',
   availableFrom: '',
   hourlyRate: '',
   contactPhone: '',
   contactAddress: '',
   contactEmail: '',
});

/**
 * Manual submit function triggered by button click
 */
async function manualSubmit() {
   console.log('Manual submit clicked');

   // Reset errors
   submitErrors.value = '';
   Object.keys(errors).forEach((key) => {
      errors[key] = '';
   });

   // Validate form
   try {
      formSchema.parse(formState);
   }
   catch (error) {
      if (error instanceof z.ZodError) {
         error.errors.forEach((err) => {
            const path = err.path[0] as string;
            errors[path] = err.message;
         });
         submitErrors.value = 'Please fix the form errors';
         return;
      }
   }

   // Submit form
   await submitForm();
}

/**
 * Actual form submission logic
 */
async function submitForm() {
   isSubmitting.value = true;

   try {
      console.log('Submitting form with data:', formState);

      // Create a payload with the correct types
      const payload: Partial<CourseListing> = {
         ...formState,
         hourlyRate: Number(formState.hourlyRate),
      };

      console.log('Sending payload to API:', payload);

      const response = await useNuxtApp().$api('/course-listing', {
         method: 'POST',
         body: payload,
      });

      console.log('API response:', response);

      toast.add({
         title: 'Success',
         description: 'Course listing created successfully',
         color: 'green',
      });

      return navigateTo(`/app/teacher/courses/${courseId}`);
   }
   catch (error) {
      console.error('Form submission error:', error);
      submitErrors.value = error instanceof Error ? error.message : 'Failed to create the listing';

      toast.add({
         title: 'Error',
         description: submitErrors.value,
         color: 'error',
      });
   }
   finally {
      isSubmitting.value = false;
   }
}

/* ---------------------------------------------------------------------------------------------- */

/*
 * Auto suggestions
 */

// const titleSuggestion = ref('');
//
// function applyTitle() {
//    formState.title = titleSuggestion.value;
//    titleSuggestion.value = '';
// }

/* ---------------------------------------------------------------------------------------------- */

useAppTitle('Add new class listing');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <section class="mx-auto max-w-2xl">
         <Heading2 class="mb-3">
            Add new listing
         </Heading2>

         <!-- Show any submission errors -->
         <UAlert
            v-if="submitErrors"
            color="error"
            variant="soft"
            class="mb-4"
            :title="submitErrors"
         />

         <div class="bg-white p-6 rounded-2xl shadow-sm border border-first-100">
            <div class="flex flex-col gap-6">
               <!-- Title Section -->
               <div class="space-y-2">
                  <UFormField
                     label="Title"
                     name="title"
                     :error="errors.title"
                  >
                     <UInput
                        v-model="formState.title"
                        placeholder="A descriptive title for your course listing"
                        class="w-full"
                     />
                  </UFormField>
               </div>

               <!-- Description Section -->
               <UFormField
                  label="Description"
                  name="description"
                  :error="errors.description"
               >
                  <UTextarea
                     v-model="formState.description"
                     :rows="6"
                     placeholder="Describe what students will learn, your teaching style, and other important details"
                     resize
                     class="w-full"
                  />
               </UFormField>

               <!-- Dates Section -->
               <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UFormField
                     label="Listing date"
                     name="listingDate"
                     help="When should this listing appear on the platform"
                     :error="errors.listingDate"
                  >
                     <InputVueDatepicker
                        v-model="formState.listingDate"
                        allow-future
                        deny-past
                        class="w-full"
                     />
                  </UFormField>

                  <UFormField
                     label="Available from"
                     name="availableFrom"
                     help="When can students start taking this course"
                     :error="errors.availableFrom"
                  >
                     <InputVueDatepicker
                        v-model="formState.availableFrom"
                        allow-future
                        deny-past
                        class="w-full"
                     />
                  </UFormField>
               </div>

               <!-- Pricing Section -->
               <UFormField
                  label="Class Fee (per hour)"
                  name="hourlyRate"
                  help="Set your hourly teaching rate"
                  :error="errors.hourlyRate"
               >
                  <UInput
                     v-model="formState.hourlyRate"
                     placeholder="Eg. 1000.00"
                     type="number"
                     class="w-full"
                     icon="i-heroicons-currency-dollar"
                  />
               </UFormField>

               <!-- Contact Information Section -->
               <div class="mt-2 pt-4 border-t border-first-100">
                  <h3 class="text-lg font-medium text-second-700 mb-4">
                     Contact Information
                  </h3>

                  <div class="space-y-5">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <UFormField
                           label="Phone"
                           name="contactPhone"
                           help="Your contact phone number for students"
                           :error="errors.contactPhone"
                        >
                           <UInput
                              v-model="formState.contactPhone"
                              placeholder="Eg. 077 1234 123"
                              icon="i-heroicons-phone"
                           />
                        </UFormField>

                        <UFormField
                           label="Email"
                           name="contactEmail"
                           help="Your contact email for students"
                           :error="errors.contactEmail"
                        >
                           <UInput
                              v-model="formState.contactEmail"
                              placeholder="Eg. hello@hello.com"
                              icon="i-heroicons-envelope"
                           />
                        </UFormField>
                     </div>

                     <UFormField
                        name="contactAddress"
                        label="Address"
                        help="Your teaching location or address"
                        :error="errors.contactAddress"
                     >
                        <UTextarea
                           v-model="formState.contactAddress"
                           :rows="3"
                           placeholder="Enter your full address"
                        />
                     </UFormField>
                  </div>
               </div>

               <!-- Submit Buttons -->
               <footer class="mt-6 flex justify-end gap-3">
                  <UButton
                     type="button"
                     color="success"
                     variant="solid"
                     :loading="isSubmitting"
                     @click="manualSubmit"
                  >
                     Create listing
                  </UButton>

                  <ButtonCancel :to="`/app/teacher/courses/${courseId}`" />
               </footer>
            </div>
         </div>
      </section>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
