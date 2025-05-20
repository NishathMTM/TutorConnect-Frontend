<script setup lang="ts">
import type { CourseCategory } from '~~/__backend/courses/types';

/* ---------------------------------------------------------------------------------------------- */

const emit = defineEmits(['select']);

/* ---------------------------------------------------------------------------------------------- */

/*
 * course category id is the v-model value
 */

const modelValue = defineModel<number | undefined>({ default: undefined });

/* ---------------------------------------------------------------------------------------------- */

const courseCategories = ref([] as CourseCategory[]);

// Move API call inside onMounted hook
onMounted(async () => {
   try {
      courseCategories.value = await useNuxtApp().$api<CourseCategory[]>('/course/course-categories');
   }
   catch (error) {
      console.error(error);
   }
});

watch(modelValue, () => {
   emit('select', courseCategories.value.find((courseCategory) => {
      return courseCategory.id === modelValue.value;
   }));
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <USelectMenu
      v-model="modelValue"
      searchable
      searchable-placeholder="Search cities..."
      :options="courseCategories"
      option-attribute="courseCategory"
      value-attribute="id"
      placeholder="Select Course Category"
   />
</template>

<style scoped lang="postcss"></style>
