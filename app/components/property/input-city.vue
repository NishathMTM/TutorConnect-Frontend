<script setup lang="ts">
import type { City } from '~~/__backend/properties/types';

/* ---------------------------------------------------------------------------------------------- */

const emit = defineEmits(['select']);

/* ---------------------------------------------------------------------------------------------- */

/*
 * city id is the v-model value
 */

const modelValue = defineModel<number | undefined>({ default: undefined });

/* ---------------------------------------------------------------------------------------------- */

const cities = ref([] as City[]);

try {
   cities.value = await useNuxtApp().$api<City[]>('/property/cities');
}
catch (error) {
   console.error(error);
}

watch(modelValue, () => {
   emit('select', cities.value.find((city) => {
      return city.id === modelValue.value;
   }));
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <USelectMenu
      v-model="modelValue"
      searchable
      searchable-placeholder="Search cities..."
      :options="cities"
      option-attribute="city"
      value-attribute="id"
      placeholder="Select city"
   />
</template>

<style scoped lang="postcss"></style>
