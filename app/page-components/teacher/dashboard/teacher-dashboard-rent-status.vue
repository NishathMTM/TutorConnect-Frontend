<script setup lang="ts">
import { useApiGetLandlordRentStatus } from '~~/__backend/tenancy-payments/api';
import TableWrapper from '~/components/wrappers/table-wrapper.vue';
import { formatDateString, formatLKR } from '~/utils/formatting-utils';

const { user } = useUserSession();
const landlordId = ref(user.value?.id ?? 0);

const { rentStatus, execute } = useApiGetLandlordRentStatus(landlordId);
await execute();

const columns = [
   { key: 'property', label: 'Property' },
   { key: 'tenant', label: 'Tenant' },
   { key: 'rent', label: 'Rent' },
   { key: 'status', label: 'Status' },
   { key: 'actions', label: 'Actions', class: 'w-10' },
];

function getStatusColor(status: string) {
   switch (status) {
      case 'OVERDUE':
         return 'text-red-600 bg-red-50';
      case 'UPCOMING':
         return 'text-amber-600 bg-amber-50';
      case 'PAID':
         return 'text-green-600 bg-green-50';
      case 'DUE_SOON':
         return 'text-orange-600 bg-orange-50';
      default:
         return 'text-gray-600 bg-gray-50';
   }
}
</script>

<template>
   <section v-if="rentStatus.length > 0">
      <header class="mb-5 flex items-center gap-2">
         <Heading2>Rent Status</Heading2>
         <!--         <UButton -->
         <!--            variant="soft" -->
         <!--            size="xs" -->
         <!--            to="/app/landlord/rent-payments" -->
         <!--         > -->
         <!--            All payments -->
         <!--         </UButton> -->
      </header>

      <TableWrapper>
         <UTable :columns :rows="rentStatus">
            <!-- Property Column -->
            <template #property-data="{ row }">
               <div class="text-sm">
                  <div>{{ row.property.address }}</div>
                  <div class="text-xs text-gray-500">
                     {{ row.property.street }}
                  </div>
               </div>
            </template>

            <!-- Tenant Column -->
            <template #tenant-data="{ row }">
               <div class="text-sm">
                  {{ row.tenant.profile.fullName }}
               </div>
            </template>

            <!-- Rent Column -->
            <template #rent-data="{ row }">
               <div class="text-sm">
                  <div>{{ formatLKR(row.rentAmount) }}</div>
                  <div v-if="row.rentStatus.totalDue" class="text-xs text-red-600 font-semibold">
                     Due: {{ formatLKR(row.rentStatus.totalDue) }}
                  </div>
               </div>
            </template>

            <!-- Status Column -->
            <template #status-data="{ row }">
               <div class="text-sm">
                  <UBadge
                     :class="getStatusColor(row.rentStatus.status)"
                     variant="soft"
                  >
                     {{ row.rentStatus.status }}
                  </UBadge>
                  <div class="mt-1 text-xs">
                     {{ row.rentStatus.message }}
                  </div>
                  <div v-if="row.rentStatus.unpaidMonths?.length" class="mt-1 text-xs text-red-600">
                     Unpaid months:
                     <div class="font-mono">
                        {{ row.rentStatus.unpaidMonths.map(date => formatDateString(date, 'MMM yyyy')).join(', ') }}
                     </div>
                  </div>
               </div>
            </template>

            <!-- Actions Column -->
            <template #actions-data="{ row }">
               <UButton
                  :icon="iconLibrary.external"
                  variant="ghost"
                  :to="`/app/landlord/rent-payments/history/${row.tenancyId}`"
               />
            </template>
         </UTable>
      </TableWrapper>
   </section>
</template>

<style scoped lang="postcss">

</style>
