<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';

const { bookings } = defineProps<{
   bookings: BookingFull[];
}>();

const stats = computed(() => {
   const pending = bookings.filter(b => b.status === CourseBookingStatus.PENDING).length;
   const approved = bookings.filter(b => b.status === CourseBookingStatus.APPROVED).length;
   const completed = bookings.filter(b => b.status === CourseBookingStatus.COMPLETED).length;
   const total = bookings.length;

   return { pending, approved, completed, total };
});
</script>

<template>
   <div class="mb-6 font-bold text-xl">
      Class Booking Statistics
   </div>

   <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <!-- Total Bookings -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <div class="flex items-center gap-2">
            <UIcon name="i-fluent:book-24-regular" class="size-5 text-blue-600" />
            <div>
               <p class="text-sm text-blue-700">
                  Total
               </p>
               <p class="text-xl font-bold text-blue-800">
                  {{ stats.total }}
               </p>
            </div>
         </div>
      </div>

      <!-- Pending Bookings -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
         <div class="flex items-center gap-2">
            <UIcon name="i-fluent:clock-24-regular" class="size-5 text-yellow-600" />
            <div>
               <p class="text-sm text-yellow-700">
                  Pending
               </p>
               <p class="text-xl font-bold text-yellow-800">
                  {{ stats.pending }}
               </p>
            </div>
         </div>
      </div>

      <!-- Approved Bookings -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
         <div class="flex items-center gap-2">
            <UIcon name="i-fluent:checkmark-24-regular" class="size-5 text-green-600" />
            <div>
               <p class="text-sm text-green-700">
                  Approved
               </p>
               <p class="text-xl font-bold text-green-800">
                  {{ stats.approved }}
               </p>
            </div>
         </div>
      </div>

      <!-- Completed Bookings -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <div class="flex items-center gap-2">
            <UIcon name="i-fluent:checkmark-circle-24-regular" class="size-5 text-blue-600" />
            <div>
               <p class="text-sm text-blue-700">
                  Completed
               </p>
               <p class="text-xl font-bold text-blue-800">
                  {{ stats.completed }}
               </p>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
