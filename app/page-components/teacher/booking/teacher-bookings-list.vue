<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { formatDateTimeString } from '~/utils/formatting-utils';
import { iconLibrary } from '~/utils/icons-utils';

const { bookings } = defineProps<{
   bookings: BookingFull[];
}>();

// Group bookings by course
const groupedBookings = computed(() => {
   const groups = new Map<number, { course: any; bookings: BookingFull[] }>();

   bookings.forEach((booking) => {
      const courseId = booking.courseListing.courseId;
      if (!groups.has(courseId)) {
         groups.set(courseId, {
            course: booking.courseListing,
            bookings: [],
         });
      }
      groups.get(courseId)!.bookings.push(booking);
   });

   return Array.from(groups.values());
});
</script>

<template>
   <div class="space-y-8">
      <div
         v-for="group in groupedBookings"
         :key="group.course.courseId"
         class="border border-first-100 rounded-xl p-6 bg-white"
      >
         <!-- Course Header -->
         <div class="flex gap-4 mb-6 pb-4 border-b border-first-100">
            <aside class="shrink-0">
               <img
                  v-if="group.course.course.primaryImage"
                  class="size-20 shrink-0 rounded object-cover"
                  :src="group.course.course.primaryImage.imageUrl"
                  alt="Course"
               >
               <div
                  v-else
                  class="size-20 rounded border-2 border-first-300 border-dashed bg-first-100 flex items-center justify-center"
               >
                  <UIcon name="i-fluent:book-24-regular" class="size-10 text-first-500" />
               </div>
            </aside>

            <div class="flex-1">
               <h2 class="font-bold text-first-700 text-xl mb-2">
                  {{ group.course.title }}
               </h2>
               <p class="text-second-600 mb-2">
                  {{ group.course.course.courseCategory.courseCategory }}
               </p>
               <p class="text-sm text-second-500">
                  {{ group.bookings.length }} booking{{ group.bookings.length !== 1 ? 's' : '' }}
               </p>
            </div>
         </div>

         <!-- Bookings Grid -->
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
               v-for="booking in group.bookings"
               :key="booking.id"
               class="border border-first-50 rounded-lg p-4 bg-first-25 hover:shadow-sm transition-shadow"
            >
               <!-- Student Info -->
               <div class="mb-3">
                  <p class="font-medium text-first-700 text-sm mb-1">
                     {{ booking.student.profile.fullName }}
                  </p>
                  <div class="mb-2">
                     <BookingStatus :status="booking.status" size="xs" />
                  </div>
               </div>

               <!-- Date & Time -->
               <div class="flex items-center gap-1 text-xs text-second-600 mb-3">
                  <UIcon :name="iconLibrary.time" class="size-3" />
                  <span>{{ formatDateTimeString(booking.bookingDateTime) }}</span>
               </div>

               <!-- Remarks -->
               <div class="mb-3">
                  <p class="text-xs text-second-500 line-clamp-2">
                     {{ booking.bookingRemarks || 'No remarks' }}
                  </p>
               </div>

               <!-- Action -->
               <div class="flex justify-end">
                  <UButton
                     size="xs"
                     variant="soft"
                     :icon="iconLibrary.external"
                     :to="`/app/teacher/course-bookings/${booking.id}`"
                  >
                     View
                  </UButton>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss">
.line-clamp-2 {
   display: -webkit-box;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
   overflow: hidden;
}
</style>
