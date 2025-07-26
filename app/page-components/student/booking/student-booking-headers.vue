<script setup lang="ts">
import type { ApiGetAllBookingsForTeacherQuery } from '~~/__backend/course-bookings/api';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';

/* ---------------------------------------------------------------------------------------------- */

const modelQueryParams = defineModel<ApiGetAllBookingsForTeacherQuery>('query', {
   default: {
      status: 'ALL',
      archived: false,
   },
});

/* ---------------------------------------------------------------------------------------------- */

const statusMenuItems = [
   { label: 'All', value: 'ALL' },
   { label: 'Approved', value: CourseBookingStatus.APPROVED },
   { label: 'Pending', value: CourseBookingStatus.PENDING },
   { label: 'Cancelled by landlord', value: CourseBookingStatus.CANCELLED_BY_TEACHER },
   { label: 'Cancelled by user', value: CourseBookingStatus.CANCELLED_BY_USER },
   { label: 'Expired', value: CourseBookingStatus.EXPIRED },
];
</script>

<template>
   <PageHeader>
      <!-- region: left -->
      <div class="flex gap-2 items-center flex-1">
         <p class="text-sm">
            Status
         </p>
         <div class="w-64">
            <USelectMenu
               v-model="modelQueryParams.status"
               :options="statusMenuItems"
               option-attribute="label"
               value-attribute="value"
            />
         </div>
      </div>

      <!-- endregion: left -->

      <!-- region: right -->
      <div class="flex gap-2 items-center">
         <p class="text-sm">
            Archived
         </p>
         <div>
            <UToggle v-model="modelQueryParams.archived" />
         </div>
      </div>
      <!-- region: right -->
   </PageHeader>
</template>

<style scoped>

</style>
