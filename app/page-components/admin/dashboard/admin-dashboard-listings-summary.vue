<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminApiGetCourseListingsStats } from '~~/__backend/_admin/api';

const { execute, stats, error, status } = useAdminApiGetCourseListingsStats();
const isLoading = ref(true);

onMounted(async () => {
   isLoading.value = true;
   try {
      await execute();
      console.log('Course listings stats response:', stats.value);
   }
   catch (err) {
      console.error('Error fetching course listings stats:', err);
   }
   finally {
      isLoading.value = false;
   }
});

// Fallback calculations if API doesn't return proper data
const displayStats = computed(() => {
   if (stats.value) {
      return stats.value;
   }

   // Return default values if no data
   return {
      total: 0,
      active: 0,
      inactive: 0,
   };
});
</script>

<template>
   <section class="bg-white rounded-xl border border-first-100 p-6 shadow-sm mb-8">
      <header class="mb-6 pb-4 border-b border-first-100">
         <div class="flex items-center gap-3">
            <div>
               <Heading2 class="mb-1">
                  Course Listings Summary
               </Heading2>
               <p class="text-sm text-second-500">
                  Overview of all course listings in the system
               </p>
            </div>
         </div>
      </header>

      <div v-if="isLoading" class="flex items-center justify-center py-8">
         <UIcon name="i-fluent:spinner-ios-16-regular" class="size-6 text-first-500 animate-spin mr-2" />
         <span class="text-second-500">Loading listings statistics...</span>
      </div>

      <div v-else-if="error" class="text-center py-8">
         <UIcon name="i-fluent:error-circle-24-regular" class="size-12 text-red-400 mx-auto mb-3" />
         <p class="text-red-600 mb-2">
            Failed to load listings statistics
         </p>
         <UButton size="sm" @click="execute()">
            Try Again
         </UButton>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <!-- Total Listings -->
         <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
               <div class="bg-blue-400 rounded-lg p-2">
                  <UIcon name="i-fluent:book-24-regular" class="size-5 text-white" />
               </div>
               <div>
                  <p class="text-sm text-blue-700 font-medium">
                     Total Listings
                  </p>
                  <p class="text-2xl font-bold text-blue-800">
                     {{ displayStats.total }}
                  </p>
               </div>
            </div>
         </div>

         <!-- Active Listings -->
         <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
               <div class="bg-green-400 rounded-lg p-2">
                  <UIcon name="i-fluent:checkmark-circle-24-regular" class="size-5 text-white" />
               </div>
               <div>
                  <p class="text-sm text-green-700 font-medium">
                     Active Listings
                  </p>
                  <p class="text-2xl font-bold text-green-800">
                     {{ displayStats.active }}
                  </p>
               </div>
            </div>
         </div>

         <!-- Inactive Listings -->
         <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
               <div class="bg-gray-500 rounded-lg p-2">
                  <UIcon name="i-fluent:pause-circle-24-regular" class="size-5 text-white" />
               </div>
               <div>
                  <p class="text-sm text-gray-700 font-medium">
                     Inactive Listings
                  </p>
                  <p class="text-2xl font-bold text-gray-800">
                     {{ displayStats.inactive }}
                  </p>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>

<style scoped lang="postcss"></style>
