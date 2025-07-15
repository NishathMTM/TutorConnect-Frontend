<script setup lang="ts">
import { useApiGetAllTenanciesByTenant } from '~~/__backend/tenancy/api';

/* ---------------------------------------------------------------------------------------------- */

const { user } = useUserSession();

const tenantId = ref(user.value?.id ?? 0);

const query = reactive({
   status: 'ALL',
});

const statusOptions = [
   { label: 'All', value: 'ALL' },
   { label: 'Active', value: 'ACTIVE' },
   { label: 'Completed', value: 'COMPLETED' },
   { label: 'Early Terminated', value: 'EARLY_TERMINATED' },
   { label: 'Pending', value: 'PENDING' },
   { label: 'Renewed', value: 'RENEWED' },
];

const apiTenancies = reactive(useApiGetAllTenanciesByTenant(tenantId, query));
apiTenancies.execute();

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div>
      <!-- region: toolbar -->
      <PageHeader class="mb-5">
         <!-- region: Filter -->
         <div class=" flex items-center gap-2">
            <span class="text-sm">Status:</span>
            <USelect
               v-model="query.status"
               :options="statusOptions"
               option-attribute="label"
               value-attribute="value"
               class="w-48"
               @update:model-value="apiTenancies.execute()"
            />
         </div>
      </PageHeader>
      <!-- endregion: toolbar -->

      <!-- region: Table -->
      <TenancyListTable :rows="apiTenancies.tenancies" type="tenant" />
      <!-- endregion: Table -->
   </div>
</template>

<style scoped lang="postcss">

</style>
