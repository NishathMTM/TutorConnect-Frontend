<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';

const { bookings } = defineProps<{
   bookings: BookingFull[];
}>();
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
                  Booking Overview
               </Heading2>
               <p class="text-sm text-second-500">
                  Track your booking performance
               </p>
            </div>
         </div>
      </header>

      <BookingStats :bookings="bookings" />
   </section>
</template>

<style scoped lang="postcss"></style>
