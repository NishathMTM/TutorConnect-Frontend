<script setup lang="ts">
import type { Course } from '~~/__backend/courses/types';
import { useApiGetAllCourseListings } from '~~/__backend/course-listings/api';
import { formatLKR } from '~/utils/formatting-utils';

/* ---------------------------------------------------------------------------------------------- */

const { course } = defineProps<{
   course: Course;
}>();

/* ---------------------------------------------------------------------------------------------- */

const courseId = ref(course.id);
const apiListings = reactive(useApiGetAllCourseListings(courseId));

onMounted(() => {
   apiListings.execute();
});

/* ---------------------------------------------------------------------------------------------- */

function getListingLink(listingId: number) {
   return `/app/teacher/course-listings/${listingId}`;
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="rounded-xl border border-first-100 bg-white p-4">
      <div class="mb-4 flex items-center justify-between">
         <h2 class="text-lg font-semibold text-first-700">
            Available Listings
         </h2>
         <ButtonCreate :to="`/app/teacher/course-listings/${courseId}/add`">
            Add new listing
         </ButtonCreate>
      </div>

      <div v-if="apiListings.status === 'pending'" class="py-4">
         <USkeleton class="h-32" />
      </div>

      <div v-else-if="apiListings.listings.length === 0" class="py-4 text-center">
         <p class="text-sm text-second-400">
            No listings available for this course
         </p>
      </div>

      <div v-else class="space-y-3">
         <div
            v-for="listing in apiListings.listings"
            :key="listing.id"
            class="rounded-lg border border-first-50 p-3 hover:border-first-200 transition-colors"
         >
            <div class="flex justify-between">
               <div>
                  <h3 class="font-medium text-first-700">
                     {{ listing.title }}
                  </h3>
                  <div class="mt-1 flex items-center gap-2 text-sm text-second-500">
                     <span>Available from: {{ listing.availableFrom }}</span>
                     <span class="text-first-500 font-semibold">{{ formatLKR(listing.hourlyRate) }}/hour</span>
                  </div>
               </div>

               <div class="flex items-center">
                  <UChip
                     size="sm"
                     :color="listing.status === 'ACTIVE' ? 'success' : 'secondary'"
                     class="mr-2"
                  >
                     {{ listing.status }}
                  </UChip>
                  <UButton
                     size="xs"
                     variant="soft"
                     color="neutral"
                     :to="getListingLink(listing.id)"
                     icon="i-heroicons-eye"
                  >
                     View
                  </UButton>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
