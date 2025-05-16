<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

interface HandymanSkill {
   id: number;
   skill: string;
   description: string;
}

interface City {
   id: number;
   city: string;
}

interface UserProfile {
   id: number;
   userId: number;
   fullName: string;
   gender: string;
   dob: string;
   address: string;
   avatarUrl: string;
   nic: string;
   phone1: string;
   phone2: string;
   createdAt: string;
   updatedAt: string;
}

interface User {
   id: number;
   email: string;
   role: string;
   createdAt: string;
   updatedAt: string;
   profile: UserProfile;
   profileCreated: boolean;
   isAdmin: boolean;
}

interface Handyman {
   id: number;
   userId: number;
   expYears: number;
   nic: string;
   adminApproved: number;
   createdAt: string;
   updatedAt: string;
   handymanSkills: HandymanSkill[];
   cities: City[];
   user: User;
}

interface HandymanResponse {
   data: Handyman[];
   meta: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
      firstPage: number;
      firstPageUrl: string;
      lastPageUrl: string;
      nextPageUrl: string | null;
      previousPageUrl: string | null;
   };
}

const props = defineProps<{
   maintenanceId: number;
   tenancyId: number;
   isOpen: boolean;
}>();

const emit = defineEmits<{
   (e: 'close'): void;
   (e: 'select', handyman: Handyman): void;
   (e: 'update:isOpen', value: boolean): void;
}>();

// Two-way binding for modal state to avoid direct prop mutation
const modalOpen = computed({
   get: () => props.isOpen,
   set: value => emit('update:isOpen', value),
});

// State
const searchQuery = ref('');
const selectedHandyman = ref<Handyman | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Pagination
const currentPage = ref(1);
const perPage = ref(10);

// Handymen data
const handymen = ref<Handyman[]>([]);
const pagination = reactive({
   total: 0,
   perPage: 10,
   currentPage: 1,
   lastPage: 1,
   firstPage: 1,
});

// Fetch handymen
async function fetchHandymen() {
   loading.value = true;
   error.value = null;

   try {
      const response = await useNuxtApp().$api<HandymanResponse>(
         `/handyman/available?page=${currentPage.value}&perPage=${perPage.value}&search=${encodeURIComponent(searchQuery.value)}`,
      );

      handymen.value = response.data;
      pagination.currentPage = response.meta.currentPage;
      pagination.lastPage = response.meta.lastPage;
      pagination.perPage = response.meta.perPage;
      pagination.total = response.meta.total;
   }
   catch (err: any) {
      error.value = err?.response?._data?.message || 'Failed to load handymen';
   }
   finally {
      loading.value = false;
   }
}

// Watch for search query changes with debounce
const debouncedSearch = useDebounceFn(() => {
   currentPage.value = 1; // Reset to first page on new search
   fetchHandymen();
}, 300);

watch(searchQuery, () => {
   debouncedSearch();
});

// Watch for page changes
watch(currentPage, () => {
   fetchHandymen();
});

// Watch for modal open state
watch(() => props.isOpen, (isOpen) => {
   if (isOpen) {
      // Reset state and fetch data when modal opens
      searchQuery.value = '';
      selectedHandyman.value = null;
      currentPage.value = 1;
      fetchHandymen();
   }
});

// Handle handyman selection
function selectHandyman(handyman: Handyman) {
   selectedHandyman.value = handyman;
}

// Confirm selection
async function confirmSelection() {
   if (!selectedHandyman.value)
      return;

   try {
      loading.value = true;

      // Call API to assign handyman to maintenance request
      await useNuxtApp().$api(`/tenancy-maintenance/${props.maintenanceId}/attach-handyman/${selectedHandyman.value.userId}`, {
         method: 'PUT',
      });

      // Emit selected handyman and close modal
      emit('select', selectedHandyman.value);
      emit('update:isOpen', false);
   }
   catch (err: any) {
      error.value = err?.response?._data?.message || 'Failed to assign handyman';
   }
   finally {
      loading.value = false;
   }
}

// Close modal
function closeModal() {
   emit('update:isOpen', false);
   emit('close');
}

// Computed properties for pagination
const showPagination = computed(() => pagination.lastPage > 1);
const paginationRange = computed(() => {
   const range = [];
   const maxButtons = 5;
   const startPage = Math.max(1, pagination.currentPage - Math.floor(maxButtons / 2));
   const endPage = Math.min(pagination.lastPage, startPage + maxButtons - 1);

   for (let i = startPage; i <= endPage; i++) {
      range.push(i);
   }

   return range;
});

// Load initial data
onMounted(() => {
   if (props.isOpen) {
      fetchHandymen();
   }
});
</script>

<template>
   <UModal v-model="modalOpen" @close="closeModal">
      <UCard>
         <template #header>
            <div class="flex items-center justify-between">
               <h3 class="text-lg font-medium">
                  Select Handyman
               </h3>
               <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="closeModal" />
            </div>
         </template>

         <!-- Search and filters -->
         <div class="mb-4">
            <UInput
               v-model="searchQuery"
               placeholder="Search handymen by name or skill..."
               icon="i-heroicons-magnifying-glass"
               :loading="loading"
               class="w-full"
            />
         </div>

         <!-- Error message -->
         <UAlert
            v-if="error"
            color="red"
            :title="error"
            icon="i-heroicons-exclamation-circle"
            class="mb-4"
         />

         <!-- Handymen list -->
         <div class="max-h-[400px] overflow-y-auto">
            <div v-if="loading && !handymen.length" class="py-8 text-center">
               <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mx-auto" />
               <p class="mt-2 text-gray-500">
                  Loading handymen...
               </p>
            </div>

            <div v-else-if="!handymen.length" class="py-8 text-center">
               <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-gray-400 mx-auto" />
               <p class="mt-2 text-gray-500">
                  No handymen found
               </p>
            </div>

            <div v-else class="space-y-2">
               <div
                  v-for="handyman in handymen"
                  :key="handyman.id"
                  class="p-3 rounded-lg border cursor-pointer transition-colors"
                  :class="{
                     'border-primary-500 bg-primary-50': selectedHandyman?.id === handyman.id,
                     'border-gray-200 hover:bg-gray-50': selectedHandyman?.id !== handyman.id,
                  }"
                  @click="selectHandyman(handyman)"
               >
                  <div class="flex items-center justify-between">
                     <div>
                        <div class="font-medium">
                           {{ handyman.user.profile.fullName }}
                        </div>
                        <div class="text-sm text-gray-600">
                           {{ handyman.user.profile.phone1 }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                           {{ handyman.expYears }} years experience
                        </div>
                        <div v-if="handyman.handymanSkills?.length" class="mt-1 flex flex-wrap gap-1">
                           <UBadge
                              v-for="skill in handyman.handymanSkills"
                              :key="skill.id"
                              color="blue"
                              variant="soft"
                              size="xs"
                           >
                              {{ skill.skill }}
                           </UBadge>
                        </div>
                     </div>
                     <div class="flex flex-col items-end">
                        <div v-if="handyman.cities?.length" class="text-xs text-gray-500 mb-1">
                           Services:
                           <div class="flex flex-wrap gap-1 mt-1 justify-end">
                              <UBadge
                                 v-for="city in handyman.cities"
                                 :key="city.id"
                                 color="gray"
                                 variant="soft"
                                 size="xs"
                              >
                                 {{ city.city }}
                              </UBadge>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Pagination -->
         <div v-if="showPagination" class="mt-4 flex items-center justify-center space-x-1">
            <UButton
               icon="i-heroicons-chevron-left"
               color="gray"
               variant="ghost"
               size="sm"
               :disabled="currentPage <= 1"
               @click="currentPage--"
            />

            <UButton
               v-for="page in paginationRange"
               :key="page"
               size="sm"
               :variant="page === currentPage ? 'solid' : 'ghost'"
               :color="page === currentPage ? 'primary' : 'gray'"
               @click="currentPage = page"
            >
               {{ page }}
            </UButton>

            <UButton
               icon="i-heroicons-chevron-right"
               color="gray"
               variant="ghost"
               size="sm"
               :disabled="currentPage >= pagination.lastPage"
               @click="currentPage++"
            />
         </div>

         <template #footer>
            <div class="flex justify-between">
               <UButton color="gray" variant="ghost" @click="closeModal">
                  Cancel
               </UButton>
               <UButton
                  color="primary"
                  :loading="loading"
                  :disabled="!selectedHandyman"
                  @click="confirmSelection"
               >
                  Assign Handyman
               </UButton>
            </div>
         </template>
      </UCard>
   </UModal>
</template>
