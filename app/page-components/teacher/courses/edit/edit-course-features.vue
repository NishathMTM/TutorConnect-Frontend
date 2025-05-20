<script setup lang="ts">
import type { Property } from '~~/__backend/properties/types';
import type { PropertyFeature } from '~~/__backend/property-features/types';
import SelectCourseFeatures
   from '~/page-components/teacher/courses/edit/select-course-features.vue';

/* ---------------------------------------------------------------------------------------------- */

const { property } = defineProps<{
   property: Property;
}>();

/* ---------------------------------------------------------------------------------------------- */

const selectedFeatures = ref<PropertyFeature[]>(property.propertyFeatures);

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section>
      <header class="mb-5">
         <Heading1>Property features</Heading1>
      </header>

      <!-- region: features -->
      <section>
         <SelectCourseFeatures
            v-model="selectedFeatures"
            :property-id="property.id"
         />
      </section>

      <!-- endregion: features -->
   </section>
</template>

<style scoped lang="postcss"></style>
