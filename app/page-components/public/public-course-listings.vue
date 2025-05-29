<script setup lang="ts">
import type { PublicGetActiveCoursesQuery } from '~~/__backend/public/api';
import {

   usePublicApiGetActiveCourses,
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
   courseCategoryId: undefined,
   courseTypeId: undefined,
   minHourlyRate: undefined,
   maxHourlyRate: undefined,
} as PublicGetActiveCoursesQuery);

if (full) {
   query.perPage = 15;
}

const apiCourseListings = reactive(usePublicApiGetActiveCourses(query));
apiCourseListings.execute();

/* ---------------------------------------------------------------------------------------------- */

const canReset = computed(() => {
   return query.courseCategoryId !== undefined
      || query.courseTypeId !== undefined
      || query.minHourlyRate !== undefined
      || query.maxHourlyRate !== undefined;
});

function reset() {
   query.courseCategoryId = undefined;
   query.courseTypeId = undefined;
   query.minHourlyRate = undefined;
   query.maxHourlyRate = undefined;
}

watch(
   () => [query.courseCategoryId, query.courseTypeId, query.minHourlyRate, query.maxHourlyRate],
   () => {
      query.page = 1; // Reset to first page when filters change
      apiCourseListings.execute();
   },
);
</script>

<template>
   <div class="flex flex-col gap-5">
      <!-- Filters -->
      <PageHeader v-if="full">
         <div class="flex flex-col gap-3 lg:flex-row lg:items-end">
            <InputCourseType
               v-model="query.courseTypeId"
               class="w-40"
            />
            <InputCourseCategory
               v-model="query.courseCategoryId"
               class="w-40"
            />
            <div class="flex items-center gap-2">
               <span class="text-sm text-gray-500">Rent Range</span>
               <div class="flex items-center gap-2">
                  <UInput
                     v-model="query.minHourlyRate"
                     type="number"
                     placeholder="Min"
                     class="w-32"
                  />
                  <span class="text-gray-500">-</span>
                  <UInput
                     v-model="query.maxHourlyRate"
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
            v-for="listing in apiCourseListings.listings"
            :key="listing.id"
            :listing="listing"
         />
      </div>

      <template v-if="full">
         <footer v-if="apiCourseListings.pagination" class="mt-10 flex items-center justify-center">
            <UPagination
               v-model="query.page"
               size="lg"
               :page-count="apiCourseListings.pagination.perPage"
               :total="apiCourseListings.pagination.total"
            />
         </footer>
      </template>
   </div>
</template>

<style scoped lang="postcss"></style>
