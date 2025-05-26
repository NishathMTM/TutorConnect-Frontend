<script setup lang="ts">
import type { PublicGetActivePropertiesQuery } from '~~/__backend/public/api';
import {

   usePublicApiGetActiveProperties,
} from '~~/__backend/public/api';
import PublicCourseListingItem from '~/page-components/public/public-course-listing-item.vue';

/* ---------------------------------------------------------------------------------------------- */

const { full = false } = defineProps<{
   full?: boolean;
}>();

/* ---------------------------------------------------------------------------------------------- */

const query = reactive({
   page: 1,
   perPage: 3,
   cityId: undefined,
   propertyTypeId: undefined,
   minRentExpectation: undefined,
   maxRentExpectation: undefined,
} as PublicGetActivePropertiesQuery);

if (full) {
   query.perPage = 15;
}

const apiPropertyListings = reactive(usePublicApiGetActiveProperties(query));
apiPropertyListings.execute();

/* ---------------------------------------------------------------------------------------------- */

const canReset = computed(() => {
   return query.cityId !== undefined
      || query.propertyTypeId !== undefined
      || query.minRentExpectation !== undefined
      || query.maxRentExpectation !== undefined;
});

function reset() {
   query.cityId = undefined;
   query.propertyTypeId = undefined;
   query.minRentExpectation = undefined;
   query.maxRentExpectation = undefined;
}

watch(
   () => [query.cityId, query.propertyTypeId, query.minRentExpectation, query.maxRentExpectation],
   () => {
      query.page = 1; // Reset to first page when filters change
      apiPropertyListings.execute();
   },
);
</script>

<template>
   <div class="flex flex-col gap-5">
      <!-- Filters -->
      <PageHeader v-if="full">
         <div class="flex flex-col gap-3 lg:flex-row lg:items-end">
            <InputPropertyType
               v-model="query.propertyTypeId"
               class="w-40"
            />
            <InputCity
               v-model="query.cityId"
               class="w-40"
            />
            <div class="flex items-center gap-2">
               <span class="text-sm text-gray-500">Rent Range</span>
               <div class="flex items-center gap-2">
                  <UInput
                     v-model="query.minRentExpectation"
                     type="number"
                     placeholder="Min"
                     class="w-32"
                  />
                  <span class="text-gray-500">-</span>
                  <UInput
                     v-model="query.maxRentExpectation"
                     type="number"
                     placeholder="Max"
                     class="w-32"
                  />
               </div>
            </div>
            <ButtonCancel
               v-if="canReset"
               @click="reset()"
            >
               Reset
            </ButtonCancel>
         </div>
      </PageHeader>

      <!-- Listings Grid -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
         <PublicCourseListingItem
            v-for="listing in apiPropertyListings.listings"
            :key="listing.id"
            :listing="listing"
         />
      </div>

      <template v-if="full">
         <footer v-if="apiPropertyListings.pagination" class="mt-10 flex items-center justify-center">
            <UPagination
               v-model="query.page"
               size="lg"
               :page-count="apiPropertyListings.pagination.perPage"
               :total="apiPropertyListings.pagination.total"
            />
         </footer>
      </template>
   </div>
</template>

<style scoped lang="postcss"></style>
