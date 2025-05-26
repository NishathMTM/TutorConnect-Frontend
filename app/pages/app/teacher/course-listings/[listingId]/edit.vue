<script setup lang="ts">
import type { CourseListing } from '~~/__backend/course-listings/types';
import { z } from 'zod';
import { useApiGetCourseListing } from '~~/__backend/course-listings/api';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-teacher'],
});

/* ---------------------------------------------------------------------------------------------- */

const { listingId } = useRoute().params;

const listingIdRef = ref(Number(listingId));

/* ---------------------------------------------------------------------------------------------- */

const apiListing = reactive(useApiGetCourseListing(listingIdRef));
await apiListing.execute();

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

// Define the form state with proper typing
const formState = reactive<Partial<CourseListing>>({
   courseId: apiListing.listing?.courseId,
   teacherId: apiListing.listing?.teacherId,
   title: apiListing.listing?.title,
   listingDate: apiListing.listing?.listingDate,
   availableFrom: apiListing.listing?.availableFrom,
   description: apiListing.listing?.description ?? '',
   hourlyRate: apiListing.listing?.hourlyRate,
   contactPhone: apiListing.listing?.contactPhone,
   contactAddress: apiListing.listing?.contactAddress,
   contactEmail: apiListing.listing?.contactEmail,
   status: apiListing.listing?.status,
});

const isSubmitting = ref(false);
const submitErrors = ref('');

/**
 * Handler for submit
 */
async function handleSubmit() {
   console.log('submitting');

   isSubmitting.value = true;
   submitErrors.value = '';
   try {
      // Ensure hourlyRate is a number
      const payload: Partial<CourseListing> = {
         ...formState,
         hourlyRate: Number(formState.hourlyRate),
      };

      await useNuxtApp().$api(`/course-listing/${listingId}`, {
         method: 'PUT',
         body: payload,
      });

      return navigateTo(`/app/teacher/course-listings/${listingId}`);
   }
   catch (error) {
      console.error(error);
      submitErrors.value = 'Failed to update the listing';
   }

   isSubmitting.value = false;
   submitErrors.value = '';
}

/* ---------------------------------------------------------------------------------------------- */

/*
 * Auto suggestions
 */

// function resetDescription() {
//    if (apiListing.listing?.property) {
//       let description = '';
//       description += `Basic property information\n\n`;
//       description += `Number of rooms: ${apiListing.listing?.property.rooms}\n`;
//       description += `Number of bathrooms: ${apiListing.listing?.property.bathrooms}\n`;
//       description += `Floors: ${apiListing.listing?.property.floors}\n`;
//       description += `Floor area (sq.ft): ${apiListing.listing?.property.floorArea}\n`;
//       description += `\n\n`;
//       description += `Features\n\n`;
//
//       formState.description = description;
//    }
// }

const titleSuggestion = ref('');

// watchDeep(
//    () => formState.rentExpectation,
//
//    (rent) => {
//       const property = apiListing.listing?.property;
//
//       if (property) {
//          if (rent !== '') {
//             if (property.propertyType.propertyType === 'Commercial/Shop') {
//                titleSuggestion.value = `${property.propertyType.propertyType} in ${property.city.city} for ${formatLKR(Number(rent))}`;
//             }
//             titleSuggestion.value = `${property.rooms} rooms ${property.propertyType.propertyType} in ${property.city.city} for ${formatLKR(Number(rent))}`;
//          }
//       }
//    },
// );

function applyTitle() {
   formState.title = titleSuggestion.value;
   titleSuggestion.value = '';
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /app/landlord/properties/[id]/listings/[listingId]/edit
 * Description: Edit single property listing details
 */

useAppTitle('Edit listing');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <section class="mx-auto max-w-2xl">
         <header class="mb-6">
            <Heading2 class="mb-3 text-first-700">
               Edit Course Listing
            </Heading2>
            <p class="text-sm text-second-500">
               Update the details of your course listing to attract more students.
            </p>
         </header>

         <div class="mb-6">
            <UAlert
               icon="i-heroicons-information-circle"
               color="amber"
               variant="soft"
               title="Heads up!"
               description="When you change the details, make sure to check the title to see if it reflects the changes"
            />
         </div>

         <UCard class="p-6 border border-first-100">
            <UForm
               :state="formState"
               :schema="formSchema"
               @submit="(event) => void handleSubmit()"
            >
               <div class="flex flex-col gap-6">
                  <!-- Title Section -->
                  <div class="space-y-2">
                     <UFormGroup
                        label="Title"
                        name="title"
                        help="A descriptive title for your course listing"
                     >
                        <UInput
                           v-model="formState.title"
                           icon="i-heroicons-document-text"
                           placeholder="Enter a compelling title for your listing"
                        />
                     </UFormGroup>

                     <div
                        v-if="titleSuggestion"
                        class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl"
                     >
                        <div class="flex items-center gap-2">
                           <UIcon name="i-heroicons-light-bulb" class="text-amber-500" />
                           <p class="text-sm text-amber-700">
                              {{ titleSuggestion }}
                           </p>
                           <UButton
                              size="xs"
                              variant="soft"
                              color="amber"
                              @click="applyTitle()"
                           >
                              Apply
                           </UButton>
                        </div>
                     </div>
                  </div>

                  <!-- Description Section -->
                  <div class="space-y-2">
                     <UFormGroup
                        label="Description"
                        help="Provide details about what students can expect from your course"
                     >
                        <UTextarea
                           v-model="formState.description"
                           :rows="8"
                           placeholder="Description of the listing"
                           resize
                           class="w-full"
                        />
                     </UFormGroup>
                  </div>

                  <!-- Dates Section -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <UFormGroup
                        label="Listing date"
                        help="When this listing will be published"
                     >
                        <InputVueDatepicker
                           v-model="formState.listingDate"
                           allow-future
                           icon="i-heroicons-calendar"
                        />
                     </UFormGroup>

                     <UFormGroup
                        label="Available from"
                        help="When you can start teaching this course"
                     >
                        <InputVueDatepicker
                           v-model="formState.availableFrom"
                           allow-future
                           icon="i-heroicons-calendar"
                        />
                     </UFormGroup>
                  </div>

                  <!-- Pricing Section -->
                  <UFormGroup
                     label="Hourly Rate"
                     name="hourlyRate"
                     help="Your teaching rate per hour"
                  >
                     <UInput
                        v-model="formState.hourlyRate"
                        icon="i-heroicons-currency-dollar"
                        type="number"
                     />
                  </UFormGroup>

                  <!-- Contact Information Section -->
                  <div class="pt-4 border-t border-first-100">
                     <h3 class="text-lg font-medium text-first-700 mb-4">
                        Contact Information
                     </h3>

                     <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <UFormGroup
                              label="Contact phone"
                              name="contactPhone"
                              help="Your contact phone number for students"
                           >
                              <UInput
                                 v-model="formState.contactPhone"
                                 placeholder="Eg. 077 1234 123"
                                 icon="i-heroicons-phone"
                              />
                           </UFormGroup>

                           <UFormGroup
                              label="Contact email"
                              name="contactEmail"
                              help="Your contact email for students"
                           >
                              <UInput
                                 v-model="formState.contactEmail"
                                 placeholder="Eg. hello@hello.com"
                                 icon="i-heroicons-envelope"
                              />
                           </UFormGroup>
                        </div>

                        <UFormGroup
                           name="contactAddress"
                           label="Contact address"
                           help="Your teaching location or address"
                        >
                           <UTextarea
                              v-model="formState.contactAddress"
                              :rows="3"
                              placeholder="Enter your full address"
                              icon="i-heroicons-map-pin"
                           />
                        </UFormGroup>
                     </div>
                  </div>

                  <!-- Error message -->
                  <UAlert
                     v-if="submitErrors"
                     icon="i-heroicons-exclamation-triangle"
                     color="red"
                     variant="soft"
                     :title="submitErrors"
                  />

                  <!-- Submit Buttons -->
                  <footer class="mt-6 flex justify-end gap-3 pt-4 border-t border-first-100">
                     <ButtonUpdate
                        type="submit"
                        :loading="isSubmitting"
                     >
                        Save listing
                     </ButtonUpdate>

                     <ButtonCancel :to="`/app/teacher/course-listings/${listingId}`" />
                  </footer>
               </div>
            </UForm>
         </UCard>
      </section>
   </TeacherLayout>
</template>

<style scoped lang="postcss">

</style>
