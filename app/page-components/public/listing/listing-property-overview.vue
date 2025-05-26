<script setup lang="ts">
import type { PublicPropertyInfo } from '~~/__backend/public/types';

/* ---------------------------------------------------------------------------------------------- */

const { property } = defineProps<{
   property: PublicPropertyInfo;
}>();

const furnishedStateString = {
   FULLY_FURNISHED: 'Fully furnished',
   SEMI_FURNISHED: 'Semi furnished',
   UNFURNISHED: 'Unfurnished',
};
</script>

<template>
   <div class="flex flex-col gap-10">
      <section id="property-overview">
         <header class="section-header">
            Property Overview
         </header>

         <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CourseOverviewItem
               title="Property type"
               :icon="iconLibrary.property.propertyType"
            >
               {{ property.propertyType.propertyType }}
            </CourseOverviewItem>

            <CourseOverviewItem
               title="Floor area"
               :icon="iconLibrary.property.floorArea"
            >
               {{ property.floorArea }} sq.ft.
            </CourseOverviewItem>

            <CourseOverviewItem
               title="Floors"
               :icon="iconLibrary.property.floors"
            >
               {{ property.floors }}
            </CourseOverviewItem>

            <CourseOverviewItem
               title="Bedrooms"
               :icon="iconLibrary.property.bedroom"
            >
               {{ property.rooms }}
            </CourseOverviewItem>

            <CourseOverviewItem
               title="Bathrooms"
               :icon="iconLibrary.property.bathroom"
            >
               {{ property.bathrooms }}
            </CourseOverviewItem>

            <CourseOverviewItem
               v-if="property.carParkingCapacity > 0"
               title="Car parking space"
               :icon="iconLibrary.property.carParking"
            >
               {{ property.carParkingCapacity }}
            </CourseOverviewItem>

            <CourseOverviewItem
               v-if="property.bikeParkingCapacity > 0"
               title="Bike parking space"
               :icon="iconLibrary.property.bikeParking"
            >
               {{ property.bikeParkingCapacity }}
            </CourseOverviewItem>

            <CourseOverviewItem
               title="Furnished status"
               :icon="iconLibrary.property.furnishedState"
            >
               {{ furnishedStateString[property.furnishedState] }}
            </CourseOverviewItem>
         </div>
      </section>

      <section>
         <header class="section-header">
            Property Features
         </header>

         <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <div
               v-for="feature in property.propertyFeatures"
               :key="feature.id"
               class="rounded-md border border-first-50 bg-first-50/50 px-4 py-2"
            >
               <div class="leading-none">
                  {{ feature.feature }}
               </div>
            </div>
         </div>

         <div v-if="property.propertyFeatures.length === 0">
            No features found.
         </div>
      </section>
   </div>
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
