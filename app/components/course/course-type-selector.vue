<script setup lang="ts">
import { useApiGetAllCourseTypes } from '~~/__backend/courses/api';

const props = defineProps({
   modelValue: {
      type: Number,
      default: undefined,
   },
   placeholder: {
      type: String,
      default: 'Select course type',
   },
});
const emit = defineEmits(['update:modelValue', 'select']);
/* ---------------------------------------------------------------------------------------------- */

// Use the API composable to fetch course types
const apiCourseTypes = reactive(useApiGetAllCourseTypes());

// Execute the API call when component is mounted
onMounted(() => {
   apiCourseTypes.execute();
});

// Selected value
const selectedValue = computed({
   get: () => props.modelValue,
   set: (value) => {
      emit('update:modelValue', value);
      const selectedType = apiCourseTypes.courseTypeList.find(type => type.id === value);
      emit('select', selectedType);
   },
});

const isLoading = computed(() => apiCourseTypes.status === 'pending');
/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div>
      <!-- Loading indicator -->
      <div v-if="isLoading" class="text-second-400 text-xs mb-1">
         Loading course types...
      </div>

      <USelectMenu
         v-model="selectedValue"
         searchable
         search-placeholder="Search course types..."
         :options="apiCourseTypes.courseTypeList"
         option-attribute="courseType"
         value-attribute="id"
         :placeholder="placeholder"
         :loading="isLoading"
      >
         <template #option="{ option }">
            {{ option.courseType }}
         </template>
         <template #empty>
            <div class="p-2 text-center text-gray-500">
               No course types found
            </div>
         </template>
      </USelectMenu>
   </div>
</template>
