<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { useApiGetStudents } from '~~/__backend/_admin/api';
import { formatDateString } from '~/utils/formatting-utils';

const UAvatar = resolveComponent('UAvatar');

interface Student {
   id: number;
   email: string;
   isAdmin: boolean;
   profile: {
      fullName: string;
      phone1: string;
      address: string;
      createdAt: string;
   } | null;
}

const query = reactive({
   page: 1,
   perPage: 15,
});

const { students, status, execute, pagination } = useApiGetStudents(query);

onMounted(() => {
   execute();
});

// Debug: Watch teachers data
watch(students, (newStudents) => {
   console.log('Students data updated:', newStudents);
   console.log('Number of students:', newStudents.length);
}, { immediate: true });

const columns: TableColumn<Student>[] = [
   {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => `#${row.original.id}`,
   },
   {
      accessorKey: 'profile.fullName',
      header: 'Students',
      cell: ({ row }) => {
         const student = row.original;
         const avatarUrl = ''; // No avatar in your data structure

         return h('div', { class: 'flex items-center gap-3' }, [
            h(UAvatar, {
               src: avatarUrl,
               alt: `${student.profile?.fullName || 'Student'} avatar`,
               size: 'lg',
               ui: { background: 'bg-first-100' },
            }),
            h('div', undefined, [
               h('p', { class: 'font-medium text-first-700' }, student.profile?.fullName || 'No Profile'),
               h('p', { class: 'text-sm text-second-600' }, student.email),
            ]),
         ]);
      },
   },

   {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.original.email,
   },
   {
      accessorKey: 'profile.phone1',
      header: 'Phone',
      cell: ({ row }) => row.original.profile?.phone1 || 'N/A',
   },
   {
      accessorKey: 'profile.address',
      header: 'Address',
      cell: ({ row }) => {
         const address = row.original.profile?.address;
         return h('div', { class: 'max-w-xs truncate' }, address || 'N/A');
      },
   },

   {
      accessorKey: 'profile.createdAt',
      header: 'Profile Created',
      cell: ({ row }) => {
         const profileDate = row.original.profile?.createdAt;
         return profileDate ? formatDateString(profileDate) : 'N/A';
      },
   },
   {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
         return h('div', { class: 'flex gap-2' }, [
            h('button', {
               class: 'text-first-600 hover:text-first-800 text-sm font-medium',
               onClick: () => navigateTo(`/app/admin/teachers/${row.original.id}`),
            }, 'View'),
            h('button', {
               class: 'text-blue-600 hover:text-blue-800 text-sm font-medium',
               onClick: () => navigateTo(`/app/admin/teachers/${row.original.id}/edit`),
            }, 'Edit'),
         ]);
      },
   },
];
</script>

<template>
   <div class="bg-white rounded-xl border border-first-100 p-6 shadow-sm">
      <header class="mb-6 pb-4 border-b border-first-100">
         <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
               <div class="bg-first-500 rounded-lg p-2">
                  <UIcon name="i-fluent:hat-graduation-24-regular" class="size-6 text-white" />
               </div>
               <div>
                  <Heading2 class="mb-1">
                     Students
                  </Heading2>
                  <p class="text-sm text-second-500">
                     Manage all registered students
                     <span v-if="pagination">({{ pagination.total }} total)</span>
                  </p>
               </div>
            </div>
         </div>
      </header>

      <UTable
         :data="students"
         :columns="columns"
         :loading="status === 'pending'"
         class="flex-1"
      />

      <!-- Pagination -->
      <div v-if="pagination && pagination.total > 1" class="mt-6 flex justify-center">
         <UPagination
            v-model="query.page"
            :total="pagination.total"
            :page-count="query.perPage"
            @update:model-value="execute()"
         />
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
