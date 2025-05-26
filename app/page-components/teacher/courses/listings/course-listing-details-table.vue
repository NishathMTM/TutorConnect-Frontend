<script setup lang="ts">
import type { CourseListing } from '~~/__backend/course-listings/types';
import { useApiGetAllCourseListings } from '~~/__backend/course-listings/api';
import TableWrapper from '~/components/wrappers/table-wrapper.vue';
import { formatLKR } from '~/utils/formatting-utils';

/* ---------------------------------------------------------------------------------------------- */

const props = defineProps<{
   courseId: number;
}>();

const emit = defineEmits(['update:listings']);

/* ---------------------------------------------------------------------------------------------- */

// Fetch listings data
const courseIdRef = ref(props.courseId);
const apiListings = reactive(useApiGetAllCourseListings(courseIdRef));

// Refresh data when courseId changes
watch(() => props.courseId, (newId) => {
   courseIdRef.value = newId;
   apiListings.execute();
});

// Initial data fetch
onMounted(() => {
   apiListings.execute();
});

// Expose listings to parent component
const listings = computed(() => apiListings.listings);
defineExpose({ listings, refresh: apiListings.execute });

/* ---------------------------------------------------------------------------------------------- */

// Table configuration with proper typing
const columns = [
   { key: 'title', label: 'Title', sortable: true },
   { key: 'availableFrom', label: 'Available from', sortable: true },
   { key: 'hourlyRate', label: 'Hourly Rate', sortable: true },
   { key: 'status', label: 'Status', sortable: true },
   { key: 'actions', label: 'Actions', sortable: false },
] as const;

type SortableColumns = 'title' | 'availableFrom' | 'hourlyRate' | 'status';

const sort = ref<{ column: SortableColumns; direction: 'asc' | 'desc' }>({
   column: 'availableFrom',
   direction: 'desc',
});

const page = ref(1);
const itemsPerPage = ref(10);

// Computed sorted and paginated data
const sortedListings = computed(() => {
   if (!listings.value)
      return [];

   const sorted = [...listings.value].sort((a, b) => {
      const column = sort.value.column;
      const direction = sort.value.direction === 'desc' ? -1 : 1;

      if (column === 'title') {
         return direction * a.title.localeCompare(b.title);
      }
      else if (column === 'availableFrom') {
         return direction * (new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime());
      }
      else if (column === 'hourlyRate') {
         return direction * (a.hourlyRate - b.hourlyRate);
      }
      else if (column === 'status') {
         return direction * (a.status || '').localeCompare(b.status || '');
      }

      return 0;
   });

   return sorted;
});

const paginatedListings = computed(() => {
   const start = (page.value - 1) * itemsPerPage.value;
   const end = start + itemsPerPage.value;
   return sortedListings.value.slice(start, end);
});

const totalPages = computed(() => {
   return Math.ceil(sortedListings.value.length / itemsPerPage.value);
});

/* ---------------------------------------------------------------------------------------------- */

async function handleUpdateStatus(id: number, status: 'ACTIVE' | 'INACTIVE') {
   try {
      await useNuxtApp().$api(`/course-listing/${id}?status_only=1`, {
         method: 'PUT',
         body: {
            status,
         },
      });

      // Refresh data after status update
      await apiListings.execute();
      emit('update:listings', listings.value);
   }
   catch (error) {
      console.error(error);
   }
}

/* ---------------------------------------------------------------------------------------------- */

function toListingPage(row: CourseListing) {
   return `/app/teacher/course-listings/${row.id}`;
}

function toEditPage(row: CourseListing) {
   return `/app/teacher/course-listings/${row.id}/edit`;
}

// Helper function to safely access row properties
function getRowProperty<T extends keyof CourseListing>(row: any, property: T): CourseListing[T] {
   return row[property];
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div>
      <div v-if="apiListings.status === 'pending'" class="py-4">
         <USkeleton class="h-64" />
      </div>

      <div v-else-if="listings.length === 0" class="py-8 text-center">
         <UIcon name="i-heroicons-document-text" class="mb-2 size-8 text-gray-400 mx-auto" />
         <p class="text-sm text-gray-500">
            No course listings available for this course
         </p>
         <UButton
            class="mt-4"
            color="green"
            :to="`/app/teacher/course-listings/${courseId}/add`"
            icon="i-heroicons-plus"
         >
            Add new listing
         </UButton>
      </div>

      <TableWrapper v-else>
         <UTable
            :rows="paginatedListings"
            :columns="columns"
            :sort="sort"
            @update:sort="sort = $event"
         >
            <!-- Empty state template -->
            <template #empty>
               <div class="flex flex-col items-center justify-center py-6">
                  <UIcon name="i-heroicons-document-text" class="mb-2 size-8 text-gray-400" />
                  <p class="text-sm text-gray-500">
                     No course listings available
                  </p>
               </div>
            </template>

            <!-- Title column -->
            <template #title-header>
               <div class="w-[200px]">
                  Title
               </div>
            </template>

            <template #title-data="{ row }">
               <div class="flex gap-2">
                  <aside class="shrink-0">
                     <div class="size-12 rounded overflow-hidden">
                        <img
                           v-if="row.course?.primaryImage"
                           class="size-12 shrink-0 object-cover"
                           :src="row.course?.primaryImage.imageUrl"
                           alt="Course"
                        >
                        <div
                           v-else
                           class="size-12 rounded border-2 border-first-300 border-dashed bg-first-100 flex items-center justify-center"
                        >
                           <UIcon name="i-heroicons-photo" class="size-6 text-first-500" />
                        </div>
                     </div>
                  </aside>

                  <div>
                     <p class="mb-2 font-medium">
                        {{ row.title }}
                     </p>

                     <div>
                        <footer class="flex gap-2">
                           <UButton
                              size="xs"
                              variant="link"
                              :to="toListingPage(row as unknown as CourseListing)"
                              icon="i-heroicons-link"
                           >
                              View
                           </UButton>
                        </footer>
                     </div>
                  </div>
               </div>
            </template>

            <!-- Available From column -->
            <template #availableFrom-header>
               <div>Available from</div>
            </template>

            <template #availableFrom-data="{ row }">
               <div>
                  {{ new Date(row.availableFrom).toLocaleDateString() }}
               </div>
            </template>

            <!-- Hourly Rate column -->
            <template #hourlyRate-header>
               <div class="text-end">
                  Hourly Rate
               </div>
            </template>

            <template #hourlyRate-data="{ row }">
               <div class="text-end">
                  {{ formatLKR(row.hourlyRate) }}
               </div>
            </template>

            <!-- Status column -->
            <template #status-header>
               <div class="text-end">
                  Status
               </div>
            </template>

            <template #status-data="{ row }">
               <div class="flex w-full justify-end">
                  <UBadge
                     v-if="row.status === 'ACTIVE'"
                     color="green"
                     variant="subtle"
                     class="mr-2"
                  >
                     Active
                  </UBadge>
                  <UBadge
                     v-else
                     color="orange"
                     variant="subtle"
                     class="mr-2"
                  >
                     Inactive
                  </UBadge>

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

            <!-- Actions column -->
            <template #actions-header>
               <div class="text-end">
                  Actions
               </div>
            </template>

            <template #actions-data="{ row }">
               <div class="flex justify-end gap-2">
                  <UButton
                     size="xs"
                     color="blue"
                     variant="soft"
                     icon="i-heroicons-pencil"
                     :to="toEditPage(row as unknown as CourseListing)"
                  >
                     Edit
                  </UButton>
                  <UButton
                     size="xs"
                     color="green"
                     variant="soft"
                     icon="i-heroicons-eye"
                     :to="toListingPage(row as unknown as CourseListing)"
                  >
                     View
                  </UButton>
               </div>
            </template>
         </UTable>

         <!-- Pagination -->
         <div v-if="totalPages > 1" class="flex justify-center py-4">
            <UPagination
               v-model="page"
               :page-count="totalPages"
               :total="sortedListings.length"
               :ui="{ wrapper: 'flex items-center gap-1' }"
            />
         </div>
      </TableWrapper>
   </div>
</template>

<style scoped lang="postcss"></style>
