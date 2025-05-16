<script setup lang="ts">
import type { BadgeSize } from '#ui/types';

const { status, size = 'sm' } = defineProps<{
   status: string;
   size?: BadgeSize;
}>();

const statusStrings = new Map<string, string>([
   ['PENDING', 'Pending'],
   ['APPROVED', 'Approved'],
   ['COMPLETED', 'Completed'],
   ['CANCELLED_BY_USER', 'Cancelled by user'],
   ['CANCELLED_BY_LANDLORD', 'Cancelled by landlord'],
   ['EXPIRED', 'Expired'],
   ['ARCHIVED', 'Archived'],
   ['REVISIT_REQUESTED', 'Revisit requested'],
   ['TENANCY_CREATED', 'Tenancy created'],
]);

const statusColors = new Map<string, string>([
   ['PENDING', 'bg-visit-pending'],
   ['APPROVED', 'bg-visit-approved'],
   ['COMPLETED', 'bg-visit-completed'],
   ['CANCELLED_BY_USER', 'bg-visit-cancelledByUser'],
   ['CANCELLED_BY_LANDLORD', 'bg-visit-cancelledByLandlord'],
   ['EXPIRED', 'bg-visit-expired'],
   ['ARCHIVED', 'bg-visit-archived'],
   ['REVISIT_REQUESTED', 'bg-visit-revisitRequested'],
   ['TENANCY_CREATED', 'bg-visit-archived'],
]);
</script>

<template>
   <div
      class="uppercase px-2 py-1 text-white rounded-lg text-xs"
      :class="[statusColors.get(status)]"
   >
      {{ statusStrings.get(status) }}
   </div>
</template>

<style scoped lang="postcss"></style>
