<script setup lang="ts">
import { useApiGetAllCourseListingsByTeacher } from '~~/__backend/course-listings/api';
import AvailableListingsOverview from '~/page-components/teacher/course-listings/available-listings-overview.vue';

definePageMeta({
   middleware: ['auth-teacher'],
});

const { user } = useUserSession();

const apiListings = reactive(useApiGetAllCourseListingsByTeacher(ref(user.value!.id)));
</script>

<template>
   <TeacherLayout>
      <FullContainer>
         <header class="mb-6">
            <Heading1>Course Listings</Heading1>
            <p class="text-second-600 mt-2">
               Manage all your course listings
            </p>
         </header>

         <LoadingPlaceholder v-if="apiListings.status === 'pending'" />

         <AvailableListingsOverview v-else :listings="apiListings.listings" />
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss">

</style>
