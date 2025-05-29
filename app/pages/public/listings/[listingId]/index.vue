<script setup lang="ts">
import { usePublicApiGetCourseListing } from '~~/__backend/public/api';

import ListingCourseOverview from '~/page-components/public/listing/listing-course-overview.vue';
import { formatLKR } from '~/utils/formatting-utils';

/* ---------------------------------------------------------------------------------------------- */

const { listingId } = useRoute().params;

const apiListing = reactive(usePublicApiGetCourseListing(ref(Number(listingId))));
apiListing.execute();

const course = computed(() => {
   if (apiListing.listing) {
      return apiListing.listing?.course;
   }
   return null;
});

const listing = computed(() => {
   if (apiListing.listing) {
      return apiListing.listing;
   }
   return null;
});

/* ---------------------------------------------------------------------------------------------- */

const images = computed(() => {
   if (course.value) {
      return course.value.courseImages;
   }
   return [];
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /listings/[listingId]
 * Description: Show a single course listing page
 */

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <PublicLayout>
      <div v-if="listing && course" class="container mx-auto">
         <!-- Main Content Container -->
         <div class="max-w-7xl mx-auto px-4 py-8 lg:px-8">
            <!-- Breadcrumb -->
            <nav class="mb-6">
               <ul class="flex items-center space-x-2 text-sm text-second-500">
                  <li>
                     <NuxtLink to="/public/listings" class="hover:text-first-600">
                        Listings
                     </NuxtLink>
                  </li>
                  <li><UIcon name="i-uil:angle-right" /></li>
                  <li class="font-medium text-second-700">
                     {{ course.courseCategory.courseCategory }}
                  </li>
               </ul>
            </nav>

            <!-- Title Section -->
            <div class="mb-8">
               <h1 class="text-3xl font-bold text-second-900 mb-3">
                  {{ listing.title }}
               </h1>
               <div class="flex items-center gap-2 text-second-600">
                  <UIcon :name="iconLibrary.map" class="size-5" />
                  <span class="font-semibold uppercase">{{ course.courseCategory.courseCategory }}</span>
                  <span class="text-second-400">•</span>
                  <span class="text-green-600 font-bold">
                     {{ formatLKR(listing.hourlyRate) }}
                     <span class="text-sm font-medium">/month</span>
                  </span>
               </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid lg:grid-cols-3 gap-8">
               <!-- Left Column (2/3 width) -->
               <div class="lg:col-span-2 space-y-8">
                  <!-- Image Gallery -->
                  <section class="bg-white rounded-xl shadow-sm">
                     <ListingImageGallery :images="images" />
                  </section>

                  <!-- Property Overview -->
                  <section class="bg-white rounded-xl p-6 shadow-sm">
                     <h2 class="text-xl font-bold text-second-800 mb-4">
                        Class Overview
                     </h2>
                     <ListingCourseOverview :course="course" />
                  </section>

                  <!-- Description -->
                  <section class="bg-white rounded-xl p-6 shadow-sm">
                     <h2 class="text-xl font-bold text-second-800 mb-4">
                        Description
                     </h2>
                     <div class="prose max-w-none">
                        <p class="whitespace-pre-wrap text-second-600">
                           {{ listing.description }}
                        </p>
                     </div>
                  </section>
               </div>

               <!-- Right Column (1/3 width) -->
               <div class="lg:col-span-1 space-y-6">
                  <!-- Booking Card -->
                  <!--                  <div class="bg-white rounded-xl p-6 shadow-sm border border-first-100"> -->
                  <!--                     <ListingBookAnAppointment :listing="listing" /> -->
                  <!--                  </div> -->
               </div>
            </div>
         </div>
      </div>

      <!-- Loading State -->
      <div v-else class="container mx-auto px-4 py-8">
         <div class="max-w-7xl mx-auto">
            <USkeleton class="h-8 w-2/3 mb-4" />
            <USkeleton class="h-6 w-1/3 mb-8" />
            <div class="grid lg:grid-cols-3 gap-8">
               <div class="lg:col-span-2 space-y-8">
                  <USkeleton class="h-[400px]" />
                  <USkeleton class="h-[200px]" />
                  <USkeleton class="h-[300px]" />
               </div>
               <div class="lg:col-span-1 space-y-6">
                  <USkeleton class="h-[300px]" />
                  <USkeleton class="h-[200px]" />
               </div>
            </div>
         </div>
      </div>
   </PublicLayout>
</template>

<style scoped lang="postcss">
.feature-item {
   @apply flex shrink-0 items-center gap-2 rounded-lg bg-first-50 px-3 py-2;
}

.feature-item p {
   @apply font-medium text-second-700;
}

.feature-item .feature-item-icon {
   @apply text-first-600;
}
</style>
