<script setup lang="ts">
import type { PublicCourseListing } from '~~/__backend/public/types';
import { formatLKR } from '~/utils/formatting-utils';

/* ---------------------------------------------------------------------------------------------- */

const { listing } = defineProps<{
   listing: PublicCourseListing;
}>();
</script>

<template>
   <section class="flex flex-col overflow-hidden rounded-2xl border border-first-50 shadow-xl">
      <!-- region: aside -->
      <div class="group relative">
         <div class="absolute bottom-5 right-0 z-50 flex">
            <div
               class="flex items-center gap-1 rounded-l-2xl bg-second-600/80 px-2 py-1 uppercase text-white transition-all"
            >
               <UIcon
                  class="size-6"
                  name="i-fluent:location-ripple-16-regular"
               />
               <p>{{ listing.course.courseCategory.courseCategory }}</p>
            </div>
         </div>

         <div class="h-36 overflow-hidden">
            <ULink :to="`/public/listings/${listing.id}`">
               <img
                  v-if="listing.course.primaryImage"
                  class="h-36 w-full object-cover transition-all group-hover:scale-125"
                  :src="listing.course.primaryImage?.imageUrl"
                  :alt="listing.title"
               >
               <div
                  v-else
                  class="flex h-full items-center justify-center rounded bg-first-100"
               >
                  <UIcon
                     class="size-12 text-first-500"
                     name="i-fluent:image-circle-32-regular"
                  />
               </div>
            </ULink>
         </div>
      </div>
      <!-- endregion: aside -->

      <!-- region: main -->
      <div class="mt-3 flex-1 px-2 mb-3">
         <!-- region: quick features -->
         <div class="flex flex-wrap gap-2 text-sm @container mb-5">
            <div
               class="flex items-center justify-center rounded-lg bg-first-300 px-4 text-xs font-bold uppercase text-first-500"
            >
               {{ listing.course.courseType.courseType }}
            </div>
         </div>
         <!-- endregion: quick features -->

         <!-- region: rent details -->
         <section>
            <p class="text-2xl font-bold text-primaryColor">
               {{ formatLKR(listing.hourlyRate) }}
               <span class="text-sm font-normal text-primaryColor/50">/ Hour</span>
            </p>
         </section>
         <!-- endregion: rent details -->

         <h1 class="font-semibold text-second-600">
            {{ listing.title }}
         </h1>
      </div>
      <!-- endregion: main -->
   </section>
</template>

<style scoped lang="postcss"></style>
