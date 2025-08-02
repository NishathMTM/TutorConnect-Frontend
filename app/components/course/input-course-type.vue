<script setup lang="ts">
import type { CourseType } from '~~/__backend/courses/types';

const emit = defineEmits(['select']);

/* ---------------------------------------------------------------------------------------------- */

const modelValue = defineModel<number | undefined>({ default: undefined });

/* ---------------------------------------------------------------------------------------------- */
const courseTypes = ref([] as CourseType[]);

try {
   courseTypes.value = await useNuxtApp().$api<CourseType[]>('/course/types');
}
catch (error) {
   console.error(error);
}

const items = computed(() => {
   return courseTypes.value.map(type => ({
      label: type.courseType,
      id: type.id,
   }));
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
      v-model="modelValue"
      :items="items"
      value-key="id"
      placeholder="Select your course type here"
      width="full"
   />
</template>

<style scoped lang="postcss"></style>
