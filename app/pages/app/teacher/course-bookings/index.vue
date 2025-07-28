<script setup lang="ts">
import type { ApiGetAllBookingsForTeacherQuery } from '~~/__backend/course-bookings/api';
import { useApiGetAllBookingsForTeacher } from '~~/__backend/course-bookings/api';
import TeacherBookingsList from '~/page-components/teacher/booking/teacher-bookings-list.vue';

definePageMeta({
   middleware: ['auth-teacher'],
});

const { user } = useUserSession();

const query = reactive({
   perPage: 15,
   page: 1,
   status: 'ALL',
   archived: false,
} as ApiGetAllBookingsForTeacherQuery);

const apiBookings = reactive(useApiGetAllBookingsForTeacher(query, ref(user.value!.id)));

apiBookings.execute();
</script>

<template>
   <TeacherLayout>
      <FullContainer>
         <header class="mb-6">
            <Heading1>Course Bookings</Heading1>
         </header>

         <LoadingPlaceholder v-if="apiBookings.status === 'pending'" />

         <div v-else-if="apiBookings.bookings.length === 0" class="text-center py-12">
            <UIcon name="i-fluent:book-24-regular" class="size-16 text-second-300 mx-auto mb-4" />
            <p class="text-second-400 text-lg">
               No bookings found
            </p>
         </div>

         <TeacherBookingsList
            v-else
            :bookings="apiBookings.bookings"
         />
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
