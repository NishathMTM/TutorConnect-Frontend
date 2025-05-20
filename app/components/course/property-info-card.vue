<script setup lang="ts">
import type { Property } from '~~/__backend/properties/types';

const { property } = defineProps<{
   property: Property;
}>();

const furnishedStateString = {
   FULLY_FURNISHED: 'Fully furnished',
   SEMI_FURNISHED: 'Semi furnished',
   UNFURNISHED: 'Unfurnished',
};
</script>

<template>
   <section class="flex flex-col md:flex-row gap-5 border border-first-100 rounded-xl p-3">
      <!-- region: left -->
      <aside>
         <PropertyInfoCardImages
            :images="property.propertyImages"
         />
      </aside>
      <!-- endregion: left -->

      <!-- region: main -->
      <div class="flex-1 w-full">
         <!-- region: header -->
         <div class="mb-5">
            <div class="text-second-400 flex items-center gap-1">
               <UIcon :name="iconLibrary.property.propertyType" />
               {{ property.propertyType.propertyType }}
            </div>

            <h2 class="text-2xl font-bold text-primaryColor">
               {{ property.address }}
            </h2>

            <div class="mt-2 flex items-center text-first-500 uppercase">
               <UIcon :name="iconLibrary.map" />
               <p>{{ property.city.city }}</p>
            </div>
         </div>
         <!-- endregion: header -->

         <!-- region: features -->
         <div class="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
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
         <!-- endregion: features -->
      </div>
      <!-- endregion: main -->
   </section>
</template>

<style scoped lang="postcss">
.feature-item {
   @apply flex items-center gap-1 rounded-lg bg-second-50 px-2 py-1 shrink-0;
}

.feature-item p {
   @apply text-sm  text-second-600;
}

.feature-item .feature-item-icon {
   @apply text-second-500;
}
</style>
