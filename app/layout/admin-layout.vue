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
      to: '/app/admin/dashboard',
   },
   {
      label: 'Teachers',
      icon: 'i-heroicons-user-group',
      to: '/app/admin/teachers',
   },
   {
      label: 'Listings',
      icon: 'i-heroicons-book-open',
      to: '/app/teacher/courses',
   },
   {
      label: 'Students',
      icon: 'i-heroicons-user-group',
      to: '/app/admin/students',
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

</style>
