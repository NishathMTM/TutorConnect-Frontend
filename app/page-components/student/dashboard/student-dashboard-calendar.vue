<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import StudentBookingCalendar from '~/page-components/student/booking/student-booking-calendar.vue';

const { bookings } = defineProps<{
   bookings: BookingFull[];
}>();
</script>

<template>
   <section class="bg-white rounded-xl border border-first-100 p-6 shadow-sm">
      <header class="mb-6 pb-4 border-b border-first-100">
         <div class="flex items-center gap-3">
            <div class="bg-first-500 rounded-lg p-2">
               <UIcon name="i-fluent:calendar-24-regular" class="size-6 text-white" />
            </div>
            <div>
               <Heading2 class="mb-1">
                  Booking Calendar
               </Heading2>
               <p class="text-sm text-second-500">
                  View your upcoming classes
               </p>
            </div>
         </div>
      </header>

      <StudentBookingCalendar :bookings="bookings" />
   </section>
</template>

<style scoped lang="postcss"></style>
