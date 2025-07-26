<script setup lang="ts">
import type { ApiGetAllVisitsForLandlordQuery } from '~~/__backend/course-visits/api';
import { UButton } from '#components';
import {

   useApiGetAllVisitsForLandlord,
} from '~~/__backend/course-visits/api';

import { PropertyVisitStatus } from '~~/__backend/course-visits/types';
import TableWrapper from '~/components/wrappers/table-wrapper.vue';
import { formatDateTimeString } from '~/utils/formatting-utils';
import { iconLibrary } from '~/utils/icons-utils';

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();

const landlordId = ref(user.value?.id ?? 0);

const query = reactive({
   perPage: 15,
   page: 1,
   status: PropertyVisitStatus.PENDING,
   archived: false,
} as ApiGetAllVisitsForLandlordQuery);

/* ---------------------------------------------------------------------------------------------- */

const apiVisitsPending = reactive(useApiGetAllVisitsForLandlord({ ...query, status: PropertyVisitStatus.PENDING }, landlordId));
const apiVisitsRevisit = reactive(useApiGetAllVisitsForLandlord({ ...query, status: PropertyVisitStatus.REVISIT_REQUESTED }, landlordId));

await Promise.all([
   apiVisitsPending.execute(),
   apiVisitsRevisit.execute(),
]);

const combinedVisits = computed(() => {
   const pending = apiVisitsPending.visits || [];
   const revisit = apiVisitsRevisit.visits || [];
   return [...pending, ...revisit];
});

/* ---------------------------------------------------------------------------------------------- */

const columns = [
   { key: 'property', label: 'Property' },
   { key: 'visitor', label: 'Visitor' },
   { key: 'date', label: 'Date & Time' },
   { key: 'remarks', label: 'Remarks' },
   { key: 'status', label: 'Status' },
   { key: 'actions', label: 'Actions' },
];

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section v-if="apiVisitsPending.status === 'success' && apiVisitsRevisit.status === 'success'">
      <header class="mb-5 flex items-center gap-2">
         <Heading2>Visit requests</Heading2>
         <UButton variant="soft" size="xs" to="/app/landlord/visits">
            All visits
         </UButton>
      </header>

      <!-- region: table -->
      <TableWrapper>
         <UTable
            :columns
            :rows="combinedVisits"
         >
            <!-- region: headers -->
            <template #status-header="{ column }">
               <div class="flex justify-center">
                  {{ column.label }}
               </div>
            </template>
            <!-- endregion: headers -->

            <!-- region: rows -->
            <template #property-data="{ row }">
               <div class="flex gap-2">
                  <aside>
                     <img
                        v-if="row.propertyListing.property.primaryImage"
                        class="size-12 shrink-0 rounded object-cover"
                        :src="row.propertyListing.property.primaryImage.imageUrl"
                        alt="Property"
                     >
                     <ImagePlaceholder v-else />
                  </aside>

                  <div>
                     <div class="mb-1">
                        <div class="text-base font-semibold">
                           {{ row.propertyListing.property.address }}
                        </div>
                     </div>

                     <div class="flex gap-2 text-second-400">
                        <div class="flex items-center gap-1 text-sm uppercase">
                           <UIcon :name="iconLibrary.property.propertyType" />
                           <p class="text-sm">
                              {{ row.propertyListing.property.propertyType.propertyType }}
                           </p>
                        </div>

                        <div class="flex items-center gap-1 text-sm uppercase">
                           <UIcon :name="iconLibrary.map" />
                           <p>{{ row.propertyListing.property.city.city }}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </template>

            <template #visitor-data="{ row }">
               <div>
                  <div class="text-base font-semibold">
                     {{ row.tenant.profile.fullName }}
                  </div>
                  <div class="text-second-300">
                     {{ row.tenant.email }}
                  </div>
               </div>
            </template>

            <template #date-data="{ row }">
               <div>
                  <div class="flex items-center gap-1">
                     <UIcon :name="iconLibrary.date" />
                     <p>{{ formatDateTimeString(row.bookingDateTime) }}</p>
                  </div>
               </div>
            </template>

            <template #remarks-data="{ row }">
               <div>{{ row.bookingRemarks }}</div>
            </template>

            <template #status-data="{ row }">
               <div class="flex justify-center">
                  <BookingStatus :status="row.status" />
               </div>
            </template>

            <template #actions-data="{ row }">
               <div>
                  <UButton
                     size="xs"
                     variant="soft"
                     icon="i-fluent:share-24-regular"
                     :to="`/app/landlord/visits/${row.id}`"
                  >
                     Open
                  </UButton>
               </div>
            </template>

            <!-- endregion: rows -->
         </UTable>
      </TableWrapper>
      <!-- endregion: table -->
   </section>
   <LoadingPlaceholder v-else-if="apiVisitsPending.status === 'pending' || apiVisitsRevisit.status === 'pending'" />
   <div v-else class="py-4 text-center text-gray-500">
      Failed to load booking requests
   </div>
</template>

<style scoped lang="postcss"></style>
