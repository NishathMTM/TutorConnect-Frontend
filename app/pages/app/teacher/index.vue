<script setup lang="ts">
import { definePageMeta } from '#imports';
import TeacherLayout from '~/layout/teacher-layout.vue';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-teacher'],
});

/* ---------------------------------------------------------------------------------------------- */

useAppTitle('Dashboard');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <FullContainer>
         <!--         &lt;!&ndash; region: all listings &ndash;&gt; -->
         <!--         <TeacherDashboardAllListings /> -->
         <!--         &lt;!&ndash; endregion: all listings &ndash;&gt; -->

         <!--         <div class="h-10" /> -->

         <!--         <div class="h-10" /> -->

         <!--         &lt;!&ndash; region: all listing visits &ndash;&gt; -->
         <!--         <TeacherDashboardVisits /> -->
         <!--         &lt;!&ndash; endregion: all listing visits &ndash;&gt; -->

         <!--         <div class="h-10" /> -->

         <!--         &lt;!&ndash; region: Rent status &ndash;&gt; -->
         <!--         <TeacherDashboardRentStatus /> -->
      <!-- endregion: Rent status -->
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
