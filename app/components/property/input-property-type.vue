<script setup lang="ts">
import type { PropertyType } from '~~/__backend/properties/types';

const emit = defineEmits(['select']);

/* ---------------------------------------------------------------------------------------------- */

const modelValue = defineModel<number | undefined>({ default: undefined });

/* ---------------------------------------------------------------------------------------------- */

const propertyTypes = ref([] as PropertyType[]);

try {
   propertyTypes.value = await useNuxtApp().$api<PropertyType[]>('/property/types');
}
catch (error) {
   console.error(error);
}

watch(modelValue, () => {
   emit(
      'select',
      propertyTypes.value.find((type) => {
         return type.id === modelValue.value;
      }),
   );
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <USelectMenu
      v-model="modelValue"
      searchable
      search-placeholder="Search property types..."
      :options="propertyTypes"
      option-attribute="propertyType"
      value-attribute="id"
      placeholder="Select property type"
   ></USelectMenu>
</template>

<style scoped lang="postcss"></style>
