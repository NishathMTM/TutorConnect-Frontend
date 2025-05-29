<script setup lang="ts">
import { useAppTitle } from '~/composables/use-app-title';

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
      <PublicCourseListings full />
   </PublicLayout>
</template>

<style scoped lang="postcss">

</style>
