<script setup lang="ts">
import { useApiGetAllPropertyListingsByLandlord } from '~~/__backend/course-listings/api';

const { user } = useUserSession();

const apiListings = reactive(useApiGetAllPropertyListingsByLandlord(ref(user.value!.id)));
</script>

<template>
   <section>
      <header class="mb-5">
         <Heading2>
            Available Listings
         </Heading2>
      </header>

      <!-- region: table of listings -->
      <PropertyListingsTable dashboard-mode :listings="apiListings.listings" />
      <!-- endregion: table of listings -->
   </section>
</template>

<style scoped lang="postcss">

</style>
