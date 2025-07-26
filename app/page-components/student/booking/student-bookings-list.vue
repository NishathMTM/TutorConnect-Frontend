<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { formatDateTimeString } from '~/utils/formatting-utils';
import { iconLibrary } from '~/utils/icons-utils';

const { bookings } = defineProps<{
   bookings: BookingFull[];
}>();
</script>

<template>
   <div class="space-y-4">
      <div
         v-for="booking in bookings"
         :key="booking.id"
         class="border border-first-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
      >
         <!-- Course Details -->
         <div class="flex gap-4 mb-4">
            <aside class="shrink-0">
               <img
                  v-if="booking.courseListing.course.primaryImage"
                  class="size-16 shrink-0 rounded object-cover"
                  :src="booking.courseListing.course.primaryImage.imageUrl"
                  alt="Course"
               >
               <div
                  v-else
                  class="size-16 rounded border-2 border-first-300 border-dashed bg-first-100 flex items-center justify-center"
               >
                  <UIcon name="i-fluent:book-24-regular" class="size-8 text-first-500" />
               </div>
            </aside>

            <div class="flex-1">
               <h3 class="font-semibold text-first-700 text-lg mb-1">
                  {{ booking.courseListing.title }}
               </h3>
               <p class="text-second-600 mb-2">
                  {{ formatLKR (booking.courseListing.hourlyRate) }} / Hour
               </p>

               <!-- Date & Time -->
               <div class="flex items-center gap-2 text-sm text-second-600 mb-2">
                  <UIcon :name="iconLibrary.time" class="size-4" />
                  <span>{{ formatDateTimeString(booking.bookingDateTime) }}</span>
               </div>

               <!-- Status -->
               <div class="mb-3">
                  <BookingStatus :status="booking.status" size="sm" class="px-2 py-1 text-xs" />
               </div>
               <!-- Remarks -->
               <div class="mb-4">
                  <h4 class="text-sm font-medium text-first-600 mb-1">
                     Remarks
                  </h4>
                  <p class="text-sm text-second-600 bg-second-50 rounded-lg p-3">
                     {{ booking.bookingRemarks || 'No remarks provided' }}
                  </p>
               </div>
            </div>
         </div>

         <!-- Action -->
         <div class="flex justify-end">
            <UButton
               size="sm"
               class="text-sm py-1 px-2"
               variant="soft"
               :icon="iconLibrary.external"
               :to="`/app/student/bookings/${booking.id}`"
            >
               View Details
            </UButton>
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
