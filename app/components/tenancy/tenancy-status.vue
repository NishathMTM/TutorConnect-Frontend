<script setup lang="ts">
import type { BadgeSize } from '#ui/types';

const { status, size = 'sm' } = defineProps<{
   status: string;
   size?: BadgeSize;
}>();

const statusStrings = new Map<string, string>([
   ['PENDING', 'Pending'],
   ['ACTIVE', 'Active'],
   ['COMPLETED', 'Completed'],
   ['EARLY_TERMINATED', 'Early terminated'],
   ['RENEWED', 'Renewed'],
   ['REJECTED', 'Rejected'],
]);

const statusColors = new Map<string, string>([
   ['PENDING', 'bg-tenancy-pending text-white'],
   ['ACTIVE', 'bg-tenancy-active text-white'],
   ['COMPLETED', 'bg-tenancy-completed text-white'],
   ['EARLY_TERMINATED', 'bg-tenancy-earlyTerminated text-white'],
   ['RENEWED', 'bg-tenancy-renewed text-white'],
   ['REJECTED', 'bg-tenancy-rejected text-white'],
]);
</script>

<template>
   <div
      class="uppercase px-2 py-1 rounded-lg text-xs"
      :class="[statusColors.get(status)]"
   >
      {{ statusStrings.get(status) }}
   </div>
</template>

<style scoped lang="postcss"></style>
