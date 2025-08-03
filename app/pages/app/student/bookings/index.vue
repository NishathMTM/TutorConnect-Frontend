<script setup lang="ts">
import type { ApiGetAllBookingsForTeacherQuery } from '~~/__backend/course-bookings/api';
import { useApiGetBookingsForUser } from '~~/__backend/course-bookings/api';
import StudentBookingsList from '~/page-components/student/booking/student-bookings-list.vue';
import StudentDashboardBookingStats from '~/page-components/student/dashboard/student-dashboard-booking-stats.vue';

definePageMeta({
   middleware: ['auth-student'],
});

const query = reactive({
   perPage: 15,
   page: 1,
   status: 'ALL',
   archived: false,
} as ApiGetAllBookingsForTeacherQuery);

const apiBookings = reactive(useApiGetBookingsForUser(query));

apiBookings.execute();
</script>

<template>
   <StudentLayout>
      <FullContainer>
         <header class="mb-6">
            <Heading1>My Classes</Heading1>
         </header>

         <LoadingPlaceholder v-if="apiBookings.status === 'pending'" />

         <div v-else-if="apiBookings.bookings.length === 0" class="text-center py-12">
            <UIcon name="i-fluent:book-24-regular" class="size-16 text-second-300 mx-auto mb-4" />
            <p class="text-second-400 text-lg">
               No bookings found
            </p>
         </div>

         <div v-else>
            <!-- Booking Stats -->
            <StudentDashboardBookingStats
               :bookings="apiBookings.bookings"
               class="mb-6"
            />

            <!-- Bookings Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2  gap-4">
               <div
                  v-for="booking in apiBookings.bookings"
                  :key="booking.id"
               >
                  <StudentBookingsList :bookings="[booking]" />
               </div>
            </div>
         </div>
      </FullContainer>
   </StudentLayout>
</template>

<style scoped lang="postcss"></style>
