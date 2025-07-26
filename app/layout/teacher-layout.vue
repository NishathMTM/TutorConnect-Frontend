<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[]>([
   {
      label: 'Home',
      icon: 'i-heroicons-home',
      to: '/',
   },
   {
      label: 'Dashboard',
      icon: 'i-heroicons-chart-bar',
      to: '/app/teacher',
   },
   {
      label: 'classes',
      icon: 'i-heroicons-book-open',
      to: '/app/teacher/courses',
   },
   {
      label: 'Course Bookings',
      icon: 'i-heroicons-map-pin',
      to: '/app/teacher/course-booking',
   },
   {
      label: 'Students',
      icon: 'i-heroicons-user-group',
      to: '/app/teacher/students',
   },
]);
/* ---------------------------------------------------------------------------------------------- */

/**
 * Layout for teacher pages
 * Contains the sidebar navigation with links to:
 * - Dashboard
 * - Courses
 * - Students
 */
</script>

<template>
   <AppLayout>
      <template #sidebar>
         <UNavigationMenu
            orientation="vertical"
            class="sidebar-nav p-4"
            :items="items"
         />
      </template>

      <slot />
   </AppLayout>
</template>

<style lang="postcss">
.sidebar-nav ul div div {
   @apply border-first-200;
}
</style>
