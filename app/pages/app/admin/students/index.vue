<script setup lang="ts">
import StudentsList from '~/page-components/admin/students/students-list.vue';

definePageMeta({
   middleware: ['auth-admin'],
});
</script>

<template>
   <AdminLayout>
      <FullContainer>
         <StudentsList />
      </FullContainer>
   </AdminLayout>
</template>

<style scoped lang="postcss"></style>
