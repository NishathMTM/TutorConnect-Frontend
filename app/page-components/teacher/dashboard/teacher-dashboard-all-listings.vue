<script setup lang="ts">
import { useApiGetAllCourseListingsByTeacher } from '~~/__backend/course-listings/api';

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

      <!--      &lt;!&ndash; region: table of listings &ndash;&gt; -->
      <!--      <CourseListingsView :listings="apiListings.listings" /> -->
      <!--      &lt;!&ndash; endregion: table of listings &ndash;&gt; -->
   </section>
</template>

<style scoped lang="postcss">

</style>
