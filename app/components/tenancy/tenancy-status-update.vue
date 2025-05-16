<script setup lang="ts">
import type { Tenancy } from '~~/__backend/tenancy/types';
import { ref } from 'vue';
import { todayAsString } from '~/utils/datetime-utils';

/* ---------------------------------------------------------------------------------------------- */

const { tenancy } = defineProps<{
   tenancy: Tenancy;
}>();

const emit = defineEmits(['update']);

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const selectedStatus = ref('');

const terminationForm = ref({
   terminationReason: '',
   terminationDate: todayAsString(),
   actualEndDate: todayAsString(),
});

const completionForm = ref({
   actualEndDate: todayAsString(),
});

const statusOptions = [
   { label: 'Active', value: 'ACTIVE' },
   { label: 'Completed', value: 'COMPLETED' },
   { label: 'Early Terminated', value: 'EARLY_TERMINATED' },
   { label: 'Renewed', value: 'RENEWED' },
];

async function updateStatus(newStatus: string) {
   if (newStatus === 'EARLY_TERMINATED' || newStatus === 'COMPLETED') {
      selectedStatus.value = newStatus;
      return;
   }

   isSubmitting.value = true;
   error.value = '';

   try {
      await useNuxtApp().$api(`/tenancy/${tenancy.id}/status`, {
         method: 'PUT',
         body: {
            status: newStatus,
         },
      });

      isOpen.value = false;
      emit('update');
   }
   catch (e) {
      error.value = 'Failed to update status';
      console.error(e);
   }

   isSubmitting.value = false;
}

async function handleTermination() {
   if (!terminationForm.value.terminationReason || !terminationForm.value.terminationDate || !terminationForm.value.actualEndDate) {
      error.value = 'All fields are required';
      return;
   }

   isSubmitting.value = true;
   error.value = '';

   try {
      await useNuxtApp().$api(`/tenancy/${tenancy.id}/status`, {
         method: 'PUT',
         body: {
            status: 'EARLY_TERMINATED',
            ...terminationForm.value,
         },
      });

      isOpen.value = false;
      emit('update');
   }
   catch (e) {
      error.value = 'Failed to update status';
      console.error(e);
   }

   isSubmitting.value = false;
}

async function handleCompletion() {
   if (!completionForm.value.actualEndDate) {
      error.value = 'Actual end date is required';
      return;
   }

   isSubmitting.value = true;
   error.value = '';

   try {
      await useNuxtApp().$api(`/tenancy/${tenancy.id}/status`, {
         method: 'PUT',
         body: {
            status: 'COMPLETED',
            actualEndDate: completionForm.value.actualEndDate,
         },
      });

      isOpen.value = false;
      emit('update');
   }
   catch (e) {
      error.value = 'Failed to update status';
      console.error(e);
   }

   isSubmitting.value = false;
}
</script>

<template>
   <div>
      <ButtonUpdate @click="isOpen = true">
         Update tenancy status
      </ButtonUpdate>

      <UModal v-model="isOpen">
         <UCard>
            <template #header>
               <div class="flex items-center gap-2">
                  <UIcon :name="iconLibrary.actions.update" />
                  <h3 class="text-xl font-semibold">
                     Update Tenancy Status
                  </h3>
               </div>
            </template>

            <div class="space-y-4">
               <div>
                  <p class="mb-2 text-sm text-second-500">
                     Current status
                  </p>
                  <div class="flex">
                     <TenancyStatus :status="tenancy.status" />
                  </div>
               </div>

               <template v-if="!selectedStatus">
                  <div class="space-y-2">
                     <p class="text-sm text-second-500">
                        Select new status
                     </p>
                     <div class="space-y-2">
                        <UButton
                           v-for="option in statusOptions"
                           :key="option.value"
                           :disabled="option.value === tenancy.status || isSubmitting"
                           block
                           @click="updateStatus(option.value)"
                        >
                           {{ option.label }}
                        </UButton>
                     </div>
                  </div>
               </template>

               <template v-else-if="selectedStatus === 'EARLY_TERMINATED'">
                  <div class="space-y-4">
                     <UFormGroup label="Termination Reason" required>
                        <UTextarea
                           v-model="terminationForm.terminationReason"
                           :rows="3"
                        />
                     </UFormGroup>

                     <UFormGroup label="Termination Date" required>
                        <InputDatepicker
                           v-model="terminationForm.terminationDate"
                           allow-future
                        />
                     </UFormGroup>

                     <UFormGroup label="Actual End Date" required>
                        <InputDatepicker
                           v-model="terminationForm.actualEndDate"
                           allow-future
                        />
                     </UFormGroup>

                     <div class="flex justify-end gap-2">
                        <UButton
                           color="gray"
                           variant="soft"
                           @click="selectedStatus = ''"
                        >
                           Back
                        </UButton>
                        <UButton
                           color="primary"
                           :loading="isSubmitting"
                           @click="handleTermination"
                        >
                           Confirm Termination
                        </UButton>
                     </div>
                  </div>
               </template>

               <template v-else-if="selectedStatus === 'COMPLETED'">
                  <div class="space-y-4">
                     <UFormGroup label="Actual End Date" required>
                        <InputDatepicker
                           v-model="completionForm.actualEndDate"
                           allow-future
                        />
                     </UFormGroup>

                     <div class="flex justify-end gap-2">
                        <UButton
                           color="gray"
                           variant="soft"
                           @click="selectedStatus = ''"
                        >
                           Back
                        </UButton>
                        <UButton
                           color="primary"
                           :loading="isSubmitting"
                           @click="handleCompletion"
                        >
                           Confirm Completion
                        </UButton>
                     </div>
                  </div>
               </template>

               <AlertError v-if="error" color="red">
                  {{ error }}
               </AlertError>
            </div>

            <template #footer>
               <div class="flex justify-end">
                  <UButton
                     color="gray"
                     variant="soft"
                     @click="isOpen = false"
                  >
                     Close
                  </UButton>
               </div>
            </template>
         </UCard>
      </UModal>
   </div>
</template>
