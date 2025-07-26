<script setup lang="ts">
const { status, size = 'sm', class: externalClass } = defineProps<{
   status: string;
   size?: 'xs' | 'sm' | 'md' | 'lg';
   class?: string;
}>();

const statusStrings = new Map<string, string>([
   ['PENDING', 'Pending'],
   ['APPROVED', 'Approved'],
   ['COMPLETED', 'Completed'],
   ['CANCELLED_BY_USER', 'Cancelled by user'],
   ['CANCELLED_BY_TEACHER', 'Cancelled by teacher'],
   ['EXPIRED', 'Expired'],
   ['ARCHIVED', 'Archived'],
   ['RESCHEDULE_REQUESTED', 'Reschedule requested'],
   ['CLASS_CREATED', 'Class created'],
]);

const statusColors = new Map<string, string>([
   ['PENDING', 'bg-yellow-500'],
   ['APPROVED', 'bg-green-500'],
   ['COMPLETED', 'bg-blue-500'],
   ['CANCELLED_BY_USER', 'bg-red-500'],
   ['CANCELLED_BY_TEACHER', 'bg-red-600'],
   ['EXPIRED', 'bg-gray-500'],
   ['ARCHIVED', 'bg-gray-400'],
   ['RESCHEDULE_REQUESTED', 'bg-orange-500'],
   ['CLASS_CREATED', 'bg-blue-400'],
]);

const sizeClasses = {
   xs: 'px-1.5 py-0.5 text-xs',
   sm: 'px-2 py-1 text-xs',
   md: 'px-3 py-1.5 text-sm',
   lg: 'px-4 py-2 text-base',
};
</script>

<template>
   <div
      class="uppercase text-white rounded-lg font-medium"
      :class="[statusColors.get(status) || 'bg-gray-500', sizeClasses[size], externalClass]"
   >
      {{ statusStrings.get(status) || status }}
   </div>
</template>

<style scoped lang="postcss"></style>
