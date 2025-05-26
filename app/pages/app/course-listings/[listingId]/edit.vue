<script setup lang="ts">
import { z } from 'zod';
import { useApiGetPropertyListing } from '~~/__backend/property-listings/api';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-landlord'],
});

/* ---------------------------------------------------------------------------------------------- */

const { listingId } = useRoute().params;

const listingIdRef = ref(Number(listingId));

/* ---------------------------------------------------------------------------------------------- */

const apiListing = reactive(useApiGetPropertyListing(listingIdRef));
await apiListing.execute();

/* ---------------------------------------------------------------------------------------------- */

const formSchema = z.object({
   title: z.string().min(3, 'Title is required').max(255),
   description: z.string().optional(),
   listingDate: z.string().date(),
   availableFrom: z.string().date(),
   rentExpectation: z.coerce.number().positive('Should be a valid amount'),
   securityDeposit: z.coerce.number().positive('Should be a valid amount'),
   tenancyLength: z.coerce.number().positive('Should be positive'),
   contactPhone: z.string().min(10, 'Phone number is required'),
   contactAddress: z.string().min(1, 'Address is required'),
   contactEmail: z.string().min(1, 'Email is required'),
});

const formState = reactive({
   title: apiListing.listing?.title,
   listingDate: apiListing.listing?.listingDate,
   availableFrom: apiListing.listing?.availableFrom,
   description: apiListing.listing?.description ?? '',
   rentExpectation: apiListing.listing?.rentExpectation as number | string,
   securityDeposit: apiListing.listing?.securityDeposit as number | string,
   tenancyLength: apiListing.listing?.tenancyLength as number | string,
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
      await useNuxtApp().$api(`/property-listing/${listingId}`, {
         method: 'PUT',
         body: formState,
      });

      return navigateTo(`/app/landlord/property-listings/${listingId}`);
   }
   catch (error) {
      console.error(error);
      submitErrors.value = 'Failed to create the listing';
   }

   isSubmitting.value = false;
   submitErrors.value = '';
}

/* ---------------------------------------------------------------------------------------------- */

/*
 * Auto suggestions
 */

function resetDescription() {
   if (apiListing.listing?.property) {
      let description = '';
      description += `Basic property information\n\n`;
      description += `Number of rooms: ${apiListing.listing?.property.rooms}\n`;
      description += `Number of bathrooms: ${apiListing.listing?.property.bathrooms}\n`;
      description += `Floors: ${apiListing.listing?.property.floors}\n`;
      description += `Floor area (sq.ft): ${apiListing.listing?.property.floorArea}\n`;
      description += `\n\n`;
      description += `Features\n\n`;

      formState.description = description;
   }
}

const titleSuggestion = ref('');

watchDeep(
   () => formState.rentExpectation,

   (rent) => {
      const property = apiListing.listing?.property;

      if (property) {
         if (rent !== '') {
            if (property.propertyType.propertyType === 'Commercial/Shop') {
               titleSuggestion.value = `${property.propertyType.propertyType} in ${property.city.city} for ${formatLKR(Number(rent))}`;
            }
            titleSuggestion.value = `${property.rooms} rooms ${property.propertyType.propertyType} in ${property.city.city} for ${formatLKR(Number(rent))}`;
         }
      }
   },
);

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
   <LandlordLayout>
      <section class="mx-auto max-w-2xl">
         <Heading2 class="mb-3">
            Edit existing listing
         </Heading2>

         <div class="my-5">
            <UAlert
               icon="i-fa6-solid:circle-info"
               color="amber"
               variant="soft"
               title="Heads up!"
               description="When you change the details, make sure to check the title to see if it reflects the changes"
            />
         </div>

         <UForm
            :state="formState"
            :schema="formSchema"
            @submit="handleSubmit"
         >
            <div class="flex flex-col gap-5">
               <div class="grid grid-cols-1">
                  <UFormGroup
                     label="Title"
                     name="title"
                  >
                     <UInput v-model="formState.title" />
                  </UFormGroup>

                  <div
                     v-if="titleSuggestion"
                     class="mt-1"
                  >
                     <div class="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-xl">
                        <p class="text-sm">
                           {{ titleSuggestion }}
                        </p>
                        <UButton
                           size="xs"
                           variant="link"
                           @click="applyTitle()"
                        >
                           Apply
                        </UButton>
                     </div>
                  </div>
               </div>

               <div class="grid grid-cols-1 gap-3">
                  <UFormGroup label="Description">
                     <UTextarea
                        v-model="formState.description"
                        :rows="8"
                        placeholder="Description of the listing"
                        resize
                     />
                  </UFormGroup>

                  <UButton variant="link" size="xs" color="amber" :padded="false" @click="resetDescription">
                     Reset description
                  </UButton>
               </div>

               <div class="grid grid-cols-1 lg:grid-cols-2">
                  <UFormGroup label="Listing date">
                     <InputVueDatepicker
                        v-model="formState.listingDate"
                        allow-future
                     />
                  </UFormGroup>
               </div>

               <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <UFormGroup label="Available from">
                     <InputVueDatepicker
                        v-model="formState.availableFrom"
                        allow-future
                     />
                  </UFormGroup>

                  <UFormGroup
                     label="Tenancy length (months)"
                     name="tenancyLength"
                  >
                     <UInput v-model="formState.tenancyLength" />
                  </UFormGroup>
               </div>

               <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <UFormGroup
                     label="Rent expectation (per month)"
                     name="rentExpectation"
                  >
                     <UInput
                        v-model="formState.rentExpectation"
                        placeholder="Eg. 25,000"
                        type="number"
                     />
                  </UFormGroup>

                  <UFormGroup
                     label="Security deposit"
                     name="securityDeposit"
                  >
                     <UInput
                        v-model="formState.securityDeposit"
                        placeholder="Eg. 300,000"
                        type="number"
                     />
                  </UFormGroup>
               </div>

               <div class="grid grid-cols-2 gap-3">
                  <UFormGroup
                     label="Contact phone"
                     name="contactPhone"
                  >
                     <UInput
                        v-model="formState.contactPhone"
                        placeholder="Eg. 077 1234 123"
                     />
                  </UFormGroup>

                  <UFormGroup
                     label="Contact email"
                     name="contactEmail"
                  >
                     <UInput
                        v-model="formState.contactEmail"
                        placeholder="Eg. hello@hello.com"
                     />
                  </UFormGroup>
               </div>

               <div class="grid grid-cols-1">
                  <UFormGroup
                     name="contactAddress"
                     label="Contact address"
                  >
                     <UTextarea
                        v-model="formState.contactAddress"
                        :rows="3"
                     />
                  </UFormGroup>
               </div>
            </div>

            <footer class="mt-5 flex justify-end gap-3">
               <ButtonUpdate type="submit">
                  Save listing
               </ButtonUpdate>

               <ButtonCancel :to="`/app/landlord/property-listings/${listingId}`" />
            </footer>
         </UForm>
      </section>
   </LandlordLayout>
</template>

<style scoped lang="postcss">

</style>
