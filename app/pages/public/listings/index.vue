<script setup lang="ts">
import { useAppTitle } from '~/composables/use-app-title';
import PublicPropertyListings from '~/page-components/public/public-course-listings.vue';

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /
 * Description: Homepage
 */

useAppTitle('Recent Listings');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <PublicLayout>
      <PublicPropertyListings full />
   </PublicLayout>
</template>

<style scoped lang="postcss">

</style>
