<script setup lang="ts">
import { definePageMeta } from '#imports';
import { useApiGetBookingsForUser } from '~~/__backend/course-bookings/api';
import StudentDashboardBookingStats from '~/page-components/student/dashboard/student-dashboard-booking-stats.vue';
import StudentDashboardCalendar from '~/page-components/student/dashboard/student-dashboard-calendar.vue';

definePageMeta({
   middleware: ['auth-student'],
});

useHead({
   title: 'Student Dashboard',
});

const query = reactive({
   perPage: 15, // Get more for stats
   page: 1,
   status: 'ALL',
   archived: false,
});

const apiBookings = reactive(useApiGetBookingsForUser(query));
apiBookings.execute();
</script>

<template>
   <StudentLayout>
      <FullContainer>
         <!-- Booking Stats -->
         <div class="mb-6">
            <StudentDashboardBookingStats
               v-if="apiBookings.bookings.length > 0"
               :bookings="apiBookings.bookings"
            />
         </div>

         <!-- region: Classes -->
         <div class="mb-6">
            <StudentDashboardCalendar
               v-if="apiBookings.bookings.length > 0"
               :bookings="apiBookings.bookings"
            />
         </div>
         <!-- endregion: Classes -->
      </FullContainer>
   </StudentLayout>
</template>

<style scoped lang="postcss"></style>
