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

try {
   courseCategories.value = await useNuxtApp().$api<CourseCategory[]>('/course/course-categories');
}
catch (error) {
   console.error(error);
}

const items = computed(() => {
   return courseCategories.value.map(courseCategory => ({
      label: courseCategory.courseCategory,
      id: courseCategory.id,
   }));
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
      :items="items"
      value-key="id"
      placeholder="Select Course Category"
   />
</template>

<style scoped lang="postcss"></style>
