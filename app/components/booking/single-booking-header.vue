<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';
import { formatDateTimeString } from '~/utils/formatting-utils';

/* ---------------------------------------------------------------------------------------------- */

const { booking } = defineProps<{
   booking: BookingFull;
}>();

/* ---------------------------------------------------------------------------------------------- */

const isExpired = computed(() => booking.status === CourseBookingStatus.EXPIRED);

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex flex-col gap-5 lg:flex-row lg:gap-10">
      <div class="shrink-0">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Requested by
         </header>

         <div class="flex gap-2">
            <div>
               <div class="font-bold">
                  {{ booking.student.profile.fullName }}
               </div>
               <div class="text-sm">
                  <div class="flex items-center gap-2 text-second-400">
                     <UIcon
                        class="size-5"
                        :name="iconLibrary.map"
                     />
                     {{ booking.student.profile.address }}
                  </div>
                  <div class="flex items-center gap-2 text-second-400">
                     <UIcon
                        class="size-5"
                        :name="iconLibrary.phone"
                     />
                     {{ booking.student.profile.phone1 }}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="flex shrink-0 flex-col">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Date & Time
         </header>

         <div>
            <div class="flex items-center gap-1">
               <UIcon :name="iconLibrary.time" />
               <p>{{ formatDateTimeString(booking.bookingDateTime) }}</p>
            </div>
         </div>
      </div>

      <div class="flex flex-col">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Status
         </header>

         <div class="flex gap-1">
            <BookingStatus
               v-if="booking.archived"
               size="lg"
               :status="CourseBookingStatus.ARCHIVED"
            />

            <BookingStatus
               size="lg"
               :status="booking.status"
            />
         </div>
      </div>

      <div class="flex flex-1 flex-col">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Remarks
         </header>
         <p>{{ booking.bookingRemarks }}</p>
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
