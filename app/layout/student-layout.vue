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
      to: '/app/student',
   },
   {
      label: 'classes',
      icon: 'i-heroicons-book-open',
      to: '/app/student/classes',
   },
   {
      label: 'Class Bookings',
      icon: 'i-heroicons-map-pin',
      to: '/app/student/booking',
   },
   {
      label: 'Payment',
      icon: 'i-heroicons-user-group',
      to: '/app/student/class-payment',
   },
]);
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

<style scoped lang="postcss">
.sidebar-nav ul div div {
  @apply border-first-200;
}
</style>
