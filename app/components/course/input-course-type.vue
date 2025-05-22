<script setup lang="ts">
import type { CourseType } from '~~/__backend/courses/types';

const emit = defineEmits(['select']);

/* ---------------------------------------------------------------------------------------------- */

const modelValue = defineModel<number | undefined>({ default: undefined });

/* ---------------------------------------------------------------------------------------------- */

const courseTypes = ref([] as CourseType[]);
//
// // Move API call inside onMounted hook
// onMounted(async () => {
//    try {
//       courseTypes.value = await useNuxtApp().$api<CourseType[]>('/course/types');
//       console.log('Loaded course types:', courseTypes.value); // Debug log
//       console.log('First course type:', JSON.stringify(courseTypes.value[0]));
//    }
//    catch (error) {
//       console.error('Error loading course types:', error);
//    }
// });
//
// watch(modelValue, () => {
//    emit(
//       'select',
//       courseTypes.value.find((type) => {
//          return type.id === modelValue.value;
//       }),
//    );
// });

try {
   courseTypes.value = await useNuxtApp().$api<CourseType[]>('/course/types');
}
catch (error) {
   console.error(error);
}

watch(modelValue, () => {
   emit(
      'select',
      courseTypes.value.find((courseType) => {
         return courseType.id === modelValue.value;
      }),
   );
});
/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div>
      <!-- Add this for debugging -->
      <div v-if="courseTypes.length === 0" class="text-red-500 text-xs mb-1">
         Loading course types...
      </div>

      <USelectMenu
         v-model="modelValue"
         searchable
         search-placeholder="Search Course types..."
         :options="courseTypes"
         option-attribute="courseType"
         value-attribute="id"
         placeholder="Select course type"
      >
         <template #option="{ option }">
            {{ option.courseType }}
         </template>
      </USelectMenu>
      <!--      <USelectMenu -->
      <!--         v-model="modelValue" -->
      <!--         searchable-placeholder="Search Course types..." -->
      <!--         :options="courseTypes" -->
      <!--         option-label="courseType" -->
      <!--         option-value="id" -->
      <!--         placeholder="Select course type" -->
      <!--      > -->
      <!--         <template #option="{ option }"> -->
      <!--            {{ option.courseType }} -->
      <!--         </template> -->
      <!--      </USelectMenu> -->
   </div>
</template>

<style scoped lang="postcss"></style>
