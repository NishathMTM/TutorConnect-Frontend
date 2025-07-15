<script setup lang="ts">
import { definePageMeta } from '#imports';
/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-student'],
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * path: /app/student
 * description: Student's homepage
 */

useHead({
   title: 'Student Dashboard',
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <StudentLayout>
      <FullContainer>
         <!-- region: Classes -->
         <div class="rounded-xl border border-first-100 bg-white p-4">
            <h2 class="text-lg font-semibold text-first-700 mb-4">My Classes</h2>
            <p class="text-sm text-second-400 py-4 text-center">
               No classes available. Please check back later or browse available courses.
            </p>
         </div>
         <!-- endregion: Classes -->
      </FullContainer>
   </StudentLayout>
</template>

<style scoped lang="postcss"></style>
