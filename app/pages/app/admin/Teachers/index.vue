<script setup lang="ts">
import TeachersList from '~/page-components/admin/teachers/teachers-list.vue';

definePageMeta({
   middleware: ['auth-admin'],
});
</script>

<template>
   <AdminLayout>
      <FullContainer>
         <TeachersList />
      </FullContainer>
   </AdminLayout>
</template>

<style scoped lang="postcss"></style>
