<script setup lang="ts">
import type { CourseListing } from '~~/__backend/course-listings/types';
import { formatLKR } from '~/utils/formatting-utils';

const { listings } = defineProps<{
   listings: CourseListing[];
}>();

const stats = computed(() => {
   const total = listings.length;
   const active = listings.filter(l => l.status === 'ACTIVE').length;
   const inactive = listings.filter(l => l.status === 'INACTIVE').length;

   return { total, active, inactive };
});
</script>

<template>
   <section class="bg-white rounded-xl border border-first-100 p-6 shadow-sm mb-8">
      <header class="mb-6 pb-4 border-b border-first-100">
         <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
               <div class="bg-first-500 rounded-lg p-2">
                  <UIcon name="i-fluent:grid-24-regular" class="size-6 text-white" />
               </div>
               <div>
                  <Heading2 class="mb-1">
                     Available Listings
                  </Heading2>
                  <p class="text-sm text-second-500">
                     {{ stats.total }} total listings ({{ stats.active }} active, {{ stats.inactive }} inactive)
                  </p>
               </div>
            </div>
            <UButton
               icon="i-fluent:add-24-regular"
               to="/app/teacher/courses"
            >
               Create New Listing
            </UButton>
         </div>
      </header>

      <!-- Listings Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <div
            v-for="listing in listings"
            :key="listing.id"
            class="border border-first-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-first-25"
         >
            <!-- Course Image & Title -->
            <div class="flex gap-3 mb-4">
               <div class="size-12 rounded border border-first-300 bg-first-100 flex items-center justify-center">
                  <UIcon name="i-fluent:book-16-regular" class="size-6 text-first-500" />
               </div>

               <div class="flex-1">
                  <h3 class="font-semibold text-first-700 text-sm mb-1">
                     {{ listing.title }}
                  </h3>
                  <p class="text-xs text-second-500">
                     Course ID: {{ listing.courseId }}
                  </p>
               </div>
            </div>

            <!-- Details -->
            <div class="space-y-2 mb-4">
               <div class="flex items-center justify-between text-sm">
                  <span class="text-second-600">Available from:</span>
                  <span class="font-medium text-first-700">{{ $dayjs(listing.availableFrom).format('MMM DD, YYYY') }}</span>
               </div>

               <div class="flex items-center justify-between text-sm">
                  <span class="text-second-600">Hourly rate:</span>
                  <span class="font-semibold text-first-700">{{ formatLKR(listing.hourlyRate) }}/hour</span>
               </div>

               <div class="flex items-center justify-between text-sm">
                  <span class="text-second-600">Status:</span>
                  <UBadge
                     :color="listing.status === 'ACTIVE' ? 'success' : 'secondary'"
                     variant="soft"
                     size="xs"
                  >
                     {{ listing.status }}
                  </UBadge>
               </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
               <UButton
                  size="xs"
                  variant="soft"
                  class="flex-1"
                  :to="`/app/teacher/course-listings/${listing.id}`"
               >
                  View
               </UButton>
               <UButton
                  size="xs"
                  variant="outline"
                  class="flex-1"
                  :to="`/app/teacher/course-listings/${listing.id}/edit`"
               >
                  Edit
               </UButton>
            </div>
         </div>
      </div>

      <!-- Empty State -->
      <div v-if="listings.length === 0" class="text-center py-8">
         <UIcon name="i-fluent:book-24-regular" class="size-12 text-second-300 mx-auto mb-3" />
         <p class="text-second-400">
            No listings found
         </p>
      </div>
   </section>
</template>

<style scoped lang="postcss"></style>
