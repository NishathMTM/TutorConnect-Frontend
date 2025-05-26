<script setup lang="ts">
import { useApiGetPropertyDetails } from '~~/__backend/properties/api';
import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-landlord'],
});

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();

const { propertyId } = useRoute().params;

const apiProperty = reactive(useApiGetPropertyDetails(ref(Number(propertyId))));
await apiProperty.execute();

/* ---------------------------------------------------------------------------------------------- */

const formSchema = z.object({
   propertyId: z.number(),
   landlordId: z.number(),
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
   propertyId: Number(propertyId),
   landlordId: Number(user.value?.id),
   title: '',
   listingDate: todayAsString(),
   availableFrom: todayAsString(),
   description: '',
   rentExpectation: '' as number | string,
   securityDeposit: '' as number | string,
   tenancyLength: 12 as number | string,
   contactPhone: '077-1234-123',
   contactAddress: 'Some address\nLine1\nLine2',
   contactEmail: 'hello@hello.com',
});

const isSubmitting = ref(false);
const submitErrors = ref('');

/**
 * Handler for submit
 */
async function handleSubmit() {
   isSubmitting.value = true;
   submitErrors.value = '';
   try {
      await useNuxtApp().$api('/property-listing', {
         method: 'POST',
         body: formState,
      });

      return navigateTo(`/app/landlord/properties/${propertyId}`);
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

if (apiProperty.property) {
   let description = '';
   description += `Basic property information\n\n`;

   if (apiProperty.property.propertyType.propertyType !== 'Commercial/Shop')
      description += `Number of rooms: ${apiProperty.property.rooms}\n`;

   description += `Number of bathrooms: ${apiProperty.property.bathrooms}\n`;
   description += `Floors: ${apiProperty.property.floors}\n`;
   description += `Floor area (sq.ft): ${apiProperty.property.floorArea}\n`;
   description += `\n\n`;
   description += `Features\n\n`;

   formState.description = description;
}

const titleSuggestion = ref('');

watchDeep(
   () => formState.rentExpectation,

   (rent) => {
      const property = apiProperty.property;

      if (property) {
         if (rent !== '') {
            if (property.propertyType.propertyType !== 'Commercial/Shop') {
               titleSuggestion.value = `${property.rooms} rooms ${property.propertyType.propertyType} in ${property.city.city} for ${formatLKR(Number(rent))}`;
            }
            else {
               titleSuggestion.value = `${property.propertyType.propertyType} in ${property.city.city} for ${formatLKR(Number(rent))}`;
            }
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
 * Path: /app/landlord/properties/[id]/listings/add
 * Description: Add a new property listing
 */

useAppTitle('Add new property listing');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <LandlordLayout>
      <section class="mx-auto max-w-2xl">
         <Heading2 class="mb-3">
            Add new listing
         </Heading2>

         <div class="my-5">
            <UAlert
               icon="i-fa6-solid:circle-info"
               color="blue"
               variant="soft"
               title="Heads up!"
               description="Fill in the details first, and we will suggest a title for the listing"
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
                     <div class="flex items-center gap-2">
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

               <div class="grid grid-cols-1">
                  <UFormGroup label="Description">
                     <UTextarea
                        v-model="formState.description"
                        :rows="8"
                        placeholder="Description of the listing"
                        resize
                     />
                  </UFormGroup>
               </div>

               <div class="grid grid-cols-1 lg:grid-cols-2">
                  <UFormGroup label="Listing date">
                     <InputVueDatepicker
                        v-model="formState.listingDate"
                        allow-future
                        deny-past
                     />
                  </UFormGroup>
               </div>

               <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <UFormGroup label="Available from">
                     <InputVueDatepicker
                        v-model="formState.availableFrom"
                        allow-future
                        deny-past
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
               <ButtonCreate
                  type="submit"
                  :loading="isSubmitting"
               >
                  Create listing
               </ButtonCreate>

               <ButtonCancel :to="`/app/landlord/properties/${propertyId}`" />
            </footer>
         </UForm>
      </section>
   </LandlordLayout>
</template>

<style scoped lang="postcss"></style>
