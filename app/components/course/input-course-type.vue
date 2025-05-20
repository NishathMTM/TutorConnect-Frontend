<script setup lang="ts">
import type { CourseType } from '~~/__backend/courses/types';

const emit = defineEmits(['select']);

/* ---------------------------------------------------------------------------------------------- */

const modelValue = defineModel<number | undefined>({ default: undefined });

/* ---------------------------------------------------------------------------------------------- */

const courseTypes = ref([] as CourseType[]);

// Move API call inside onMounted hook
onMounted(async () => {
   try {
      courseTypes.value = await useNuxtApp().$api<CourseType[]>('/course/types');
   }
   catch (error) {
      console.error(error);
   }
});

watch(modelValue, () => {
   emit(
      'select',
      courseTypes.value.find((type) => {
         return type.id === modelValue.value;
      }),
   );
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <USelectMenu
      id="id"
      v-model="modelValue"
      searchable
      search-placeholder="Search Course types..."
      :options="courseTypes"
      option-attribute="courseType"
      placeholder="Select course type"
   />
</template>

<style scoped lang="postcss"></style>
