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
   const cancelled = bookings.filter(b =>
      b.status === CourseBookingStatus.CANCELLED_BY_USER
      || b.status === CourseBookingStatus.CANCELLED_BY_TEACHER,
   ).length;
   const total = bookings.length;

   return { pending, approved, completed, cancelled, total };
});
</script>

<template>
   <section class="bg-white rounded-xl border border-first-100 p-6 shadow-sm">
      <header class="mb-6 pb-4 border-b border-first-100">
         <div class="flex items-center gap-3">
            <div class="bg-first-500 rounded-lg p-2">
               <UIcon name="i-fluent:chart-multiple-24-regular" class="size-6 text-white" />
            </div>
            <div>
               <Heading2 class="mb-1">
                  My Class Bookings
               </Heading2>
               <p class="text-sm text-second-500">
                  Overview of your class booking status
               </p>
            </div>
         </div>
      </header>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
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
         <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="flex items-center gap-2">
               <UIcon name="i-fluent:checkmark-circle-24-regular" class="size-5 text-purple-600" />
               <div>
                  <p class="text-sm text-purple-700">
                     Completed
                  </p>
                  <p class="text-xl font-bold text-purple-800">
                     {{ stats.completed }}
                  </p>
               </div>
            </div>
         </div>

         <!-- Cancelled Bookings -->
         <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-2">
               <UIcon name="i-fluent:dismiss-24-regular" class="size-5 text-red-600" />
               <div>
                  <p class="text-sm text-red-700">
                     Cancelled
                  </p>
                  <p class="text-xl font-bold text-red-800">
                     {{ stats.cancelled }}
                  </p>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>

<style scoped lang="postcss"></style>
