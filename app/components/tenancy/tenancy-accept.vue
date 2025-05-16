<script setup lang="ts">
import type { Tenancy } from '~~/__backend/tenancy/types';
import { ref } from 'vue';

/* ---------------------------------------------------------------------------------------------- */

const { tenancy } = defineProps<{
   tenancy: Tenancy;
}>();

const emit = defineEmits(['update']);

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);
const isSubmitting = ref(false);
const error = ref('');

async function handleAccept() {
   isSubmitting.value = true;
   error.value = '';

   try {
      await useNuxtApp().$api(`/tenancy/${tenancy.id}/status`, {
         method: 'PUT',
         body: {
            status: 'ACTIVE',
         },
      });

      isOpen.value = false;
      emit('update');
   }
   catch (e) {
      error.value = 'Failed to accept tenancy';
      console.error(e);
   }

   isSubmitting.value = false;
}
</script>

<template>
   <div v-if="tenancy.status === 'PENDING'">
      <UButton
         color="primary"
         :icon="iconLibrary.actions.approve"
         @click="isOpen = true"
      >
         Accept Tenancy
      </UButton>

      <UModal v-model="isOpen">
         <UCard>
            <template #header>
               <div class="flex items-center gap-2">
                  <UIcon :name="iconLibrary.actions.approve" />
                  <h3 class="text-xl font-semibold">
                     Accept Tenancy
                  </h3>
               </div>
            </template>

            <div class="space-y-4">
               <p>
                  Are you sure you want to accept this tenancy? This will set the status to Active.
               </p>

               <AlertError
                  v-if="error"
                  color="red"
                  :title="error"
               />
            </div>

            <template #footer>
               <div class="flex justify-end gap-3">
                  <UButton
                     color="gray"
                     variant="soft"
                     @click="isOpen = false"
                  >
                     Cancel
                  </UButton>
                  <UButton
                     color="primary"
                     :loading="isSubmitting"
                     @click="handleAccept()"
                  >
                     Accept
                  </UButton>
               </div>
            </template>
         </UCard>
      </UModal>
   </div>
</template>
