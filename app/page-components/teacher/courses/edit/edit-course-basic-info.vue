<script setup lang="ts">
import type { Property } from '~~/__backend/properties/types';
import { useApiGetAllPropertyTypes } from '~~/__backend/properties/api';
import { z } from 'zod';
import InputCity from '~/components/property/input-city.vue';
import LocationMap from '~/page-components/landlord/properties/location-map.vue';

/* ---------------------------------------------------------------------------------------------- */

const { property } = defineProps<{
   property: Property;
}>();

const toast = useToast();

/* ---------------------------------------------------------------------------------------------- */

const apiPropertyTypes = reactive(useApiGetAllPropertyTypes());
apiPropertyTypes.execute();

/* ---------------------------------------------------------------------------------------------- */

const locationMarker = ref({ lat: property.lat, lng: property.lng });

const furnishedStateOptions = [
   { id: 'UNFURNISHED', label: 'Not furnished' },
   { id: 'SEMI_FURNISHED', label: 'Semi furnished' },
   { id: 'FULLY_FURNISHED', label: 'Fully furnished' },
];

/* ---------------------------------------------------------------------------------------------- */

const city = ref(property.city);

const formSchema = z.object({
   street: z.string().min(3, 'Street is required'),
   address: z.string().min(3, 'Address is required'),
});

const formState = reactive({
   id: property.id,
   propertyTypeId: property.propertyTypeId,
   cityId: property.cityId,
   street: property.street,
   address: property.address,
   lat: property.lat,
   lng: property.lng,
   description: property.description ?? '',
   rooms: property.rooms,
   bathrooms: property.bathrooms,
   floors: property.floors,
   floorArea: property.floorArea,
   furnishedState: property.furnishedState,
   carParkingCapacity: property.carParkingCapacity,
   bikeParkingCapacity: property.bikeParkingCapacity,
});

watch(city, (city) => {
   formState.cityId = city.id;
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
      await useNuxtApp().$api('/property', {
         method: 'PUT',
         body: {
            ...formState,
         },
      });

      toast.add({
         title: 'Updated',
         description: 'Property details are saved',
         color: 'green',
         callback: () => {
            submitDisabled.value = false;
         },
      });

      return navigateTo(`/app/landlord/properties/${property.id}`);
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
         <Heading1>Property information</Heading1>
      </header>

      <div class="">
         <UForm
            class="flex flex-col gap-5"
            :state="formState"
            :schema="formSchema"
            @submit="handleSubmit()"
         >
            <div class="flex flex-col gap-5 lg:flex-row">
               <!-- region: Fields -->
               <section class="flex flex-1 flex-col gap-5">
                  <!-- region: Property type -->
                  <section>
                     <Heading3 class="mb-3">
                        Choose the property type
                     </Heading3>

                     <div class="grid grid-cols-2 gap-3">
                        <UFormGroup
                           label="Type"
                           name="propertyTypeId"
                        >
                           <USelectMenu
                              v-model="formState.propertyTypeId"
                              :options="apiPropertyTypes.propertyTypeList"
                              option-attribute="propertyType"
                              value-attribute="id"
                           ></USelectMenu>
                        </UFormGroup>
                     </div>
                  </section>
                  <!-- endregion: Property type -->

                  <!-- region: Address -->
                  <section>
                     <Heading3 class="mb-3">
                        Update property location
                     </Heading3>

                     <div class="flex flex-col gap-5">
                        <div class="grid grid-cols-2 gap-3">
                           <UFormGroup
                              label="City"
                              help="Eg. Colombo 3"
                           >
                              <InputCity
                                 v-model="formState.cityId"
                                 @select="(payload) => (city = payload)"
                              />
                           </UFormGroup>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                           <UFormGroup
                              label="Street"
                              name="street"
                           >
                              <UInput v-model="formState.street" />
                           </UFormGroup>

                           <UFormGroup
                              label="Address"
                              name="address"
                           >
                              <UInput v-model="formState.address" />
                           </UFormGroup>
                        </div>
                     </div>
                  </section>
                  <!-- endregion: Address -->
               </section>
               <!-- endregion: Fields -->

               <!-- region: Map -->
               <section class="basis-1/3">
                  <Heading3 class="mb-3">
                     Click to add a marker
                  </Heading3>
                  <div class="z-10">
                     <LocationMap
                        v-model="locationMarker"
                        :height="300"
                     />
                  </div>

                  <div class="mt-2 flex justify-center gap-2 text-sm text-second-300">
                     <p>Latitude: {{ locationMarker.lat }}</p>
                     <p>Longitude: {{ locationMarker.lng }}</p>
                  </div>
               </section>
               <!-- endregion: Map -->
            </div>

            <!-- region: Overview -->
            <div class="flex flex-col gap-5">
               <section>
                  <Heading3 class="mb-3">
                     Overview
                  </Heading3>

                  <div class="flex flex-col gap-5">
                     <div class="grid grid-cols-1 gap-3">
                        <UFormGroup label="Description">
                           <UTextarea
                              v-model="formState.description"
                              :rows="10"
                              resize
                           />
                        </UFormGroup>
                     </div>

                     <div class="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                        <UFormGroup label="No. of bedrooms">
                           <UInput v-model="formState.rooms" />
                        </UFormGroup>

                        <UFormGroup label="No. of bathrooms">
                           <UInput v-model="formState.bathrooms" />
                        </UFormGroup>

                        <UFormGroup label="No. of floors">
                           <UInput v-model="formState.floors" />
                        </UFormGroup>

                        <UFormGroup
                           label="Floor area"
                           hint="in Sq.Ft."
                        >
                           <UInput
                              v-model="formState.floorArea"
                              placeholder="Eg. 1200"
                           />
                        </UFormGroup>
                     </div>
                  </div>
               </section>
            </div>
            <!-- endregion: Overview -->

            <!-- region: Property extra details -->
            <div class="flex flex-col gap-5">
               <section>
                  <Heading3 class="mb-3">
                     Extra details
                  </Heading3>

                  <div class="flex flex-col gap-5">
                     <div class="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                        <UFormGroup label="Furnished state">
                           <USelectMenu
                              v-model="formState.furnishedState"
                              :options="furnishedStateOptions"
                              option-attribute="label"
                              value-attribute="id"
                           />
                        </UFormGroup>

                        <UFormGroup label="Car parking space">
                           <UInput v-model="formState.carParkingCapacity" />
                        </UFormGroup>

                        <UFormGroup label="Bike parking space">
                           <UInput v-model="formState.bikeParkingCapacity" />
                        </UFormGroup>
                     </div>
                  </div>
               </section>
            </div>
            <!-- endregion: Property extra details -->

            <!-- region: Error message -->
            <section
               v-if="submitErrors"
               class="flex w-auto justify-center"
            >
               <AlertError>
                  {{ submitErrors }}
               </AlertError>
            </section>
            <!-- endregion: Error message -->

            <footer class="flex w-full justify-center gap-3">
               <ButtonUpdate
                  type="submit"
                  :loading="isSubmitting"
                  :disabled="submitDisabled"
               >
                  Update details
               </ButtonUpdate>
               <ButtonCancel
                  color="gray"
                  :to="`/app/landlord/properties/${property.id}`"
               ></ButtonCancel>
            </footer>
         </UForm>
      </div>
   </section>
</template>

<style scoped lang="postcss"></style>
