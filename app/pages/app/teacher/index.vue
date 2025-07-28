<script setup lang="ts">
import type { ApiGetAllBookingsForTeacherQuery } from '~~/__backend/course-bookings/api';
import { definePageMeta } from '#imports';
import { useApiGetAllBookingsForTeacher } from '~~/__backend/course-bookings/api';
import TeacherLayout from '~/layout/teacher-layout.vue';
import TeacherDashboardBookingStats from '~/page-components/teacher/dashboard/teacher-dashboard-booking-stats.vue';
import TeacherDashboardCalendar from '~/page-components/teacher/dashboard/teacher-dashboard-calendar.vue';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-teacher'],
});

const { user } = useUserSession();

const teacherId = ref(user.value?.id ?? 0);

const query = reactive({
   perPage: 15,
   page: 1,
   status: 'ALL',
   archived: false,
} as ApiGetAllBookingsForTeacherQuery);

const apiBookings = reactive(useApiGetAllBookingsForTeacher(query, teacherId));
await apiBookings.execute();

/* ---------------------------------------------------------------------------------------------- */

useAppTitle('Dashboard');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <FullContainer>
         <div class="space-y-8">
            <!-- region: booking stats section -->
            <TeacherDashboardBookingStats
               v-if="apiBookings.bookings"
               :bookings="apiBookings.bookings"
            />
            <!-- endregion: booking stats section -->

            <!-- region: calendar section -->
            <TeacherDashboardCalendar
               v-if="apiBookings.bookings"
               :bookings="apiBookings.bookings"
            />
         </div>
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
