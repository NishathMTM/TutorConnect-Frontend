<script setup lang="ts">
import type { CourseListing } from '~~/__backend/course-listings/types';
import TableWrapper from '~/components/wrappers/table-wrapper.vue';
import { formatLKR } from '~/utils/formatting-utils';
/* ---------------------------------------------------------------------------------------------- */

const { listings, dashboardMode = false } = defineProps<{
   listings: CourseListing[];
   dashboardMode?: boolean;
}>();

const emit = defineEmits(['update:status']);

/* ---------------------------------------------------------------------------------------------- */

const columns = [
   { key: 'title', label: 'Title' },
   { key: 'availableFrom', label: 'Available from' },
   { key: 'hourlyRate', label: 'Hourly Rate' },
];

if (!dashboardMode) {
   columns.push({ key: 'status', label: 'Status' });
}

/* ---------------------------------------------------------------------------------------------- */

async function handleUpdateStatus(id: number, status: 'ACTIVE' | 'INACTIVE') {
   try {
      await useNuxtApp().$api(`/course-listing/${id}?status_only=1`, {
         method: `PUT`,
         body: {
            status,
         },
      });

      emit('update:status');
   }
   catch (error) {
      console.error(error);
   }
}

/* ---------------------------------------------------------------------------------------------- */

function toListingPage(row: any) {
   return `/app/teacher/course-listings/${row.listingId}`;
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TableWrapper>
      <UTable
         :rows="listings"
         :columns="columns"
      >
         <template #title-header="{ column }">
            <div class="w-[200px]">
               {{ column.label }}
            </div>
         </template>

         <template #availableFrom-header="{ column }">
            <div class="text-end">
               {{ column.label }}
            </div>
         </template>

         <template #hourlyRate-header="{ column }">
            <div class="text-end">
               {{ column.label }}
            </div>
         </template>

         <template #status-header="{ column }">
            <div class="text-end">
               {{ column.label }}
            </div>
         </template>
         <!-- endregion: headers -->

         <!-- region: data -->

         <template #title-data="{ row }">
            <div class="flex gap-2">
               <aside class="shrink-0">
                  <UChip
                     size="lg"
                     position="top-left"
                     :color="row.status === 'ACTIVE' ? 'green' : 'amber'"
                  >
                     <NuxtLink :to="toListingPage(row)">
                        <img
                           v-if="row.course.primaryImage"
                           class="size-12 shrink-0 rounded object-cover"
                           :src="row.course.primaryImage.imageUrl"
                           alt="Property"
                        >

                        <div
                           v-else
                           class="size-12 rounded border-2 border-first-300 border-dashed bg-first-100 flex items-center justify-center"
                        >
                           <UIcon name="i-fluent:image-circle-32-regular" class="size-8 text-first-500" />
                        </div>
                     </NuxtLink>
                  </UChip>
               </aside>

               <div class="">
                  <p class="mb-2">
                     {{ row.title }}
                  </p>

                  <div>
                     <footer class="flex gap-2">
                        <UButton
                           size="xs"
                           :padded="false"
                           variant="link"
                           :to="toListingPage(row)"
                           icon="i-fluent:link-24-regular"
                        >
                           Listing
                        </UButton>

                        <UButton
                           v-if="dashboardMode"
                           :padded="false"
                           color="blue"
                           size="xs"
                           variant="link"
                           :to="`/app/teacher/courses/${row.courseId}`"
                           icon="i-fluent:link-24-regular"
                        >
                           Class
                        </UButton>
                     </footer>
                  </div>
               </div>
            </div>
         </template>

         <template #availableFrom-data="{ row }">
            <div class="text-end">
               {{ row.availableFrom }}
            </div>
         </template>

         <template #hourlyRate-data="{ row }">
            <div class="text-end">
               {{ formatLKR(row.hourlyRate) }}
            </div>
         </template>

         <template #status-data="{ row }">
            <div class="flex w-full justify-end">
               <UButton
                  v-if="row.status === 'INACTIVE'"
                  color="green"
                  size="xs"
                  @click="handleUpdateStatus(row.id, 'ACTIVE')"
               >
                  ACTIVATE
               </UButton>
               <UButton
                  v-else
                  color="orange"
                  size="xs"
                  @click="handleUpdateStatus(row.id, 'INACTIVE')"
               >
                  DEACTIVATE
               </UButton>
            </div>
         </template>

         <!-- endregion: data -->
      </UTable>
   </TableWrapper>
</template>

<style scoped lang="postcss"></style>
