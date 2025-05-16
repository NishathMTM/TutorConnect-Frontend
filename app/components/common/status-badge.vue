<script setup lang="ts">
const props = defineProps<{
   status: string;
   size?: 'sm' | 'md' | 'lg';
}>();

const sizeClasses = {
   sm: 'px-2 py-1 text-xs',
   md: 'px-3 py-1.5 text-sm',
   lg: 'px-4 py-2 text-base',
};

const statusColorClasses = new Map<string, string>([
   // Maintenance Status Colors
   ['PENDING', 'bg-yellow-100 text-yellow-800'],
   ['APPROVED', 'bg-green-100 text-green-800'],
   ['REJECTED', 'bg-red-100 text-red-800'],
   ['IN_PROGRESS', 'bg-blue-100 text-blue-800'],
   ['COMPLETED', 'bg-green-100 text-green-800'],
   ['CANCELLED', 'bg-gray-100 text-gray-800'],

   // Handyman Status Colors
   ['ACCEPTED', 'bg-blue-100 text-blue-800'],
   ['STARTED', 'bg-orange-100 text-orange-800'],

   // Visit Status Colors
   ['CANCELLED_BY_USER', 'bg-red-100 text-red-800'],
   ['CANCELLED_BY_LANDLORD', 'bg-red-100 text-red-800'],
   ['EXPIRED', 'bg-gray-100 text-gray-800'],
   ['ARCHIVED', 'bg-gray-100 text-gray-800'],
   ['REVISIT_REQUESTED', 'bg-purple-100 text-purple-800'],
   ['TENANCY_CREATED', 'bg-green-100 text-green-800'],

   // Default
   ['DEFAULT', 'bg-gray-100 text-gray-800'],
]);

const colorClass = computed(() => {
   return statusColorClasses.get(props.status) || statusColorClasses.get('DEFAULT');
});

const sizeClass = computed(() => {
   return sizeClasses[props.size || 'sm'];
});
</script>

<template>
   <span
      class="inline-flex items-center justify-center rounded-lg font-medium uppercase"
      :class="[colorClass, sizeClass]"
   >
      <slot>{{ status }}</slot>
   </span>
</template>
