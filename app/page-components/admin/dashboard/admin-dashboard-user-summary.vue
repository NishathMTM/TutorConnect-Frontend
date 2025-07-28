<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAdminApiGetUserStats } from '~~/__backend/_admin/api';

const { execute, stats, error, status } = useAdminApiGetUserStats();
const isLoading = ref(true);

onMounted(async () => {
   isLoading.value = true;
   try {
      await execute();
      console.log('User stats response:', stats.value);
   }
   catch (err) {
      console.error('Error fetching user stats:', err);
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
      teachers: 0,
      students: 0,
      admins: 0,
   };
});
</script>

<template>
   <section class="bg-white rounded-xl border border-first-100 p-6 shadow-sm mb-8">
      <header class="mb-6 pb-4 border-b border-first-100">
         <div class="flex items-center gap-3">
            <div>
               <Heading2 class="mb-1">
                  User Summary
               </Heading2>
               <p class="text-sm text-second-500">
                  Overview of registered users in the system
               </p>
            </div>
         </div>
      </header>

      <div v-if="isLoading" class="flex items-center justify-center py-8">
         <UIcon name="i-fluent:spinner-ios-16-regular" class="size-6 text-first-500 animate-spin mr-2" />
         <span class="text-second-500">Loading user statistics...</span>
      </div>

      <div v-else-if="error" class="text-center py-8">
         <UIcon name="i-fluent:error-circle-24-regular" class="size-12 text-red-400 mx-auto mb-3" />
         <p class="text-red-600 mb-2">
            Failed to load user statistics
         </p>
         <UButton size="sm" @click="execute()">
            Try Again
         </UButton>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
         <!-- Total Users -->
         <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
               <div class="bg-blue-400 rounded-lg p-2">
                  <UIcon name="i-fluent:people-24-regular" class="size-5 text-white" />
               </div>
               <div>
                  <p class="text-sm text-blue-700 font-medium">
                     Total Users
                  </p>
                  <p class="text-2xl font-bold text-blue-800">
                     {{ displayStats.total }}
                  </p>
               </div>
            </div>
         </div>

         <!-- Teachers -->
         <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
               <div class="bg-green-400 rounded-lg p-2">
                  <UIcon name="i-fluent:hat-graduation-24-regular" class="size-5 text-white" />
               </div>
               <div>
                  <p class="text-sm text-green-700 font-medium">
                     Teachers
                  </p>
                  <p class="text-2xl font-bold text-green-800">
                     {{ displayStats.teachers }}
                  </p>
               </div>
            </div>
         </div>

         <!-- Students -->
         <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
               <div class="bg-purple-400 rounded-lg p-2">
                  <UIcon name="i-fluent:book-24-regular" class="size-5 text-white" />
               </div>
               <div>
                  <p class="text-sm text-purple-700 font-medium">
                     Students
                  </p>
                  <p class="text-2xl font-bold text-purple-800">
                     {{ displayStats.students }}
                  </p>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>

<style scoped lang="postcss"></style>
