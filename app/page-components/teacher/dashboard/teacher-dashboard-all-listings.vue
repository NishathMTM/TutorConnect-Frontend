<script setup lang="ts">
import { useApiGetAllCourseListingsByTeacher } from '~~/__backend/course-listings/api';
import AvailableListingsOverview from '~/page-components/teacher/course-listings/available-listings-overview.vue';

const { user } = useUserSession();

const apiListings = reactive(useApiGetAllCourseListingsByTeacher(ref(user.value!.id)));
</script>

<template>
   <section>
      <header class="mb-5">
         <Heading2>
            Available Class Listings
         </Heading2>
      </header>

      <!-- region: table of listings -->
      <AvailableListingsOverview :listings="apiListings.listings" />
      <!-- endregion: table of listings -->
   </section>
</template>

<style scoped lang="postcss">

</style>
