<script setup lang="ts">
import type { Property } from '~~/__backend/properties/types';

/* ---------------------------------------------------------------------------------------------- */

const { property } = defineProps<{
   property: Property;
}>();

const primaryImage = computed(() => {
   return property.primaryImage?.imageUrl;
});

const title = computed(() => {
   return `${property.rooms} rooms ${property.propertyType.propertyType} in ${property.city.city}`;
});

/* ---------------------------------------------------------------------------------------------- */

const furnishedStateString = {
   FULLY_FURNISHED: 'Fully furnished',
   SEMI_FURNISHED: 'Semi furnished',
   UNFURNISHED: 'Unfurnished',
};

/* ---------------------------------------------------------------------------------------------- */
/*
 * debug
 */

function convertNewlinesToBr(text: string): string {
   return text.replace(/\n/g, '<br/>');
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section class="flex w-full flex-col gap-5 lg:flex-row">
      <!-- region: Images -->
      <section>
         <!-- region: images -->
         <div class="flex flex-col gap-2 lg:w-[400px]">
            <div class="">
               <img
                  v-if="primaryImage"
                  class="aspect_16_9 w-auto rounded object-cover lg:w-[400px]"
                  :src="primaryImage"
                  alt="Primary image"
               />
               <div
                  v-else
                  class="aspect_16_9 flex items-center justify-center rounded-xl border-2 border-dashed border-first-100 bg-first-50"
               >
                  <p class="text-xl font-bold text-first-300">
                     No property image
                  </p>
               </div>
            </div>

            <div class="overflow-hidden">
               <div class="flex gap-2 overflow-auto lg:w-[400px]">
                  <img
                     v-for="image in property.propertyImages"
                     :key="image.imageUrlKey"
                     class="aspect_square rounded object-cover"
                     width="128"
                     :src="image.imageUrl"
                     alt="Primary image"
                  />
               </div>
            </div>
         </div>
         <!-- endregion: images -->

         <!-- region: map -->
         <div class="my-5 hidden lg:block">
            <LocationMapReadonly
               v-if="property"
               :lat="property.lat"
               :lng="property.lng"
            />
         </div>
         <!-- endregion: map -->
      </section>
      <!-- endregion: Images -->

      <!-- region: Details -->
      <div class="flex flex-col gap-5 lg:flex-1">
         <!-- region: Header -->
         <section id="property-header">
            <h1 class="text-2xl font-bold uppercase">
               {{ title }}
            </h1>

            <div class="flex items-center gap-1 uppercase text-first-600">
               <UIcon :name="iconLibrary.map" />
               <div class="">
                  {{ property.city.city }}
               </div>
            </div>
         </section>
         <!-- endregion: Header -->

         <!-- region: Overview -->
         <section id="property-overview">
            <header class="section-header">
               Overview
            </header>

            <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5">
               <PropertyOverviewItem
                  title="Property type"
                  :icon="iconLibrary.property.propertyType"
               >
                  {{ property.propertyType.propertyType }}
               </PropertyOverviewItem>

               <PropertyOverviewItem
                  title="Floor area"
                  :icon="iconLibrary.property.floorArea"
               >
                  {{ property.floorArea }} sq.ft.
               </PropertyOverviewItem>

               <PropertyOverviewItem
                  title="Floors"
                  :icon="iconLibrary.property.floors"
               >
                  {{ property.floors }}
               </PropertyOverviewItem>

               <PropertyOverviewItem
                  title="Bedrooms"
                  :icon="iconLibrary.property.bedroom"
               >
                  {{ property.rooms }}
               </PropertyOverviewItem>

               <PropertyOverviewItem
                  title="Bathrooms"
                  :icon="iconLibrary.property.bathroom"
               >
                  {{ property.bathrooms }}
               </PropertyOverviewItem>

               <PropertyOverviewItem
                  v-if="property.carParkingCapacity > 0"
                  title="Car parking space"
                  :icon="iconLibrary.property.carParking"
               >
                  {{ property.carParkingCapacity }}
               </PropertyOverviewItem>

               <PropertyOverviewItem
                  v-if="property.bikeParkingCapacity > 0"
                  title="Bike parking space"
                  :icon="iconLibrary.property.bikeParking"
               >
                  {{ property.bikeParkingCapacity }}
               </PropertyOverviewItem>

               <PropertyOverviewItem
                  title="Furnished status"
                  :icon="iconLibrary.property.furnishedState"
               >
                  {{ furnishedStateString[property.furnishedState] }}
               </PropertyOverviewItem>
            </div>
         </section>

         <!-- endregion: Overview -->

         <!-- region: Description -->
         <section id="property-description">
            <header class="section-header">
               Description
            </header>

            <div v-html="convertNewlinesToBr(property.description ?? 'No description given.')" />
         </section>
         <!-- endregion: Description -->

         <!-- region: Features -->
         <section id="property-features">
            <header class="section-header">
               Features
            </header>

            <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
               <div
                  v-for="feature in property.propertyFeatures"
                  :key="feature.id"
                  class="rounded-md border border-first-50 bg-first-50/50 px-4 py-2"
               >
                  <div class="leading-none text-sm">
                     {{ feature.feature }}
                  </div>
               </div>
            </div>

            <div v-if="property.propertyFeatures.length === 0">
               No features found.
            </div>
         </section>
         <!-- endregion: Features -->
      </div>
      <!-- endregion: Details -->
   </section>
</template>

<style scoped lang="postcss">
.icon-wrapper {
   @apply flex size-8 items-center justify-center rounded-full bg-first-600 p-1;
   @apply text-white;
}

.section-header {
   @apply mb-2 text-xl font-bold text-second-600;
}
</style>
