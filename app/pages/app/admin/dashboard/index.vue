<script setup lang="ts">
import AdminDashboardListingsSummary from '~/page-components/admin/dashboard/admin-dashboard-listings-summary.vue';
import AdminDashboardUserSummary from '~/page-components/admin/dashboard/admin-dashboard-user-summary.vue';

definePageMeta({
   middleware: ['auth-admin'],
});
</script>

<template>
   <AdminLayout>
      <div class="admin-dashboard">
         <h1 class="font-light sm:text-4xl mb-6">
            Welcome to admin dashboard
         </h1>

         <!-- User Summary Component -->
         <AdminDashboardUserSummary />

         <!-- Course Listings Summary Component -->
         <AdminDashboardListingsSummary />
      </div>
   </AdminLayout>
</template>

<style scoped lang="postcss">
.admin-dashboard {
   @apply p-4;
}
</style>
