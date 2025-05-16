<script setup lang="ts">
import type { Tenancy } from '~~/__backend/tenancy/types';
import TenancyStatus from '~/components/tenancy/tenancy-status.vue';

/* ---------------------------------------------------------------------------------------------- */

const { rows, type = 'landlord' } = defineProps<{
   rows: Tenancy[];
   type?: 'landlord' | 'tenant';
}>();

const columns = [
   { key: 'property', label: 'Property' },
   { key: 'tenant', label: 'Tenant' },
   { key: 'tenancy', label: 'Tenancy' },
   { key: 'payment', label: 'Payment' },
   { key: 'status', label: 'Status' },
   { key: 'actions', label: 'Actions', class: 'w-10' },
];

/* ---------------------------------------------------------------------------------------------- */

function tenancyPage(row: Tenancy) {
   return `/app/${type}/tenancies/${row.id}`;
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TableWrapper>
      <UTable :columns :rows>
         <template #property-data="{ row }">
            <div class="text-sm">
               <p class="font-medium text-first-700">
                  {{ row.propertyAddress }}
               </p>
            </div>
         </template>

         <template #tenant-data="{ row }">
            <div class="space-y-1 text-sm">
               <p class="font-medium text-first-700">
                  {{ row.tenantName }}
               </p>
               <p class="text-second-600">
                  {{ row.tenantPhone }}
               </p>
            </div>
         </template>

         <template #tenancy-data="{ row }">
            <div class="space-y-1 text-sm">
               <p class="text-second-600">
                  <span class="font-medium">Period:</span>
                  {{ formatDateString(row.tenancyStart) }} - {{ formatDateString(row.tenancyEnd) }}
               </p>
               <p class="text-second-600">
                  <span class="font-medium">Duration:</span>
                  {{ row.tenancyDuration }}
               </p>
            </div>
         </template>

         <template #payment-data="{ row }">
            <div class="space-y-1 text-sm">
               <p class="text-second-600">
                  <span class="font-medium">Rent:</span>
                  {{ formatLKR(row.rentAmount) }}
               </p>
               <p class="text-second-600">
                  <span class="font-medium">Due:</span>
                  Day {{ row.rentDueDay }} of each month
               </p>
            </div>
         </template>

         <template #status-data="{ row }">
            <div class="flex justify-center">
               <TenancyStatus :status="row.status" />
            </div>
         </template>

         <template #actions-data="{ row }">
            <div class="flex justify-end">
               <UButton
                  size="xs"
                  variant="soft"
                  :icon="iconLibrary.external"
                  :to="tenancyPage(row)"
               >
                  Open
               </UButton>
            </div>
         </template>
      </UTable>
   </TableWrapper>
</template>

<style scoped lang="postcss">

</style>
