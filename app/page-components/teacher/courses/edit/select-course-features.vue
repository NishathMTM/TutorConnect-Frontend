<script setup lang="ts">
import type { PropertyFeature } from '~~/__backend/property-features/types';
import { useApiGetAllPropertyFeatures } from '~~/__backend/property-features/api';

/* ---------------------------------------------------------------------------------------------- */

const { propertyId } = defineProps<{
   propertyId: number;
}>();

const toast = useToast();

/* ---------------------------------------------------------------------------------------------- */

const apiFeatures = reactive(useApiGetAllPropertyFeatures());
apiFeatures.execute();

/* ---------------------------------------------------------------------------------------------- */

const model = defineModel<PropertyFeature[]>({ default: [] });

function toggleFeature(feature: PropertyFeature) {
   if (!isSelected(feature)) {
      model.value.push(feature);

      handleClickFeature(feature, 'ATTACH');

      toast.add({
         title: 'Features',
         description: `${feature.feature} is attached to the property`,
         color: 'green',
      });
   }
   else {
      const index = model.value.findIndex(v => v.id === feature.id);
      model.value.splice(index, 1);
      handleClickFeature(feature, 'DETACH');

      toast.add({
         title: 'Features',
         description: `${feature.feature} is removed from the property`,
         color: 'red',
      });
   }
}

function isSelected(feature: PropertyFeature) {
   return model.value.find(f => f.id === feature.id);
}

/* ---------------------------------------------------------------------------------------------- */

async function handleClickFeature(feature: PropertyFeature, state: 'ATTACH' | 'DETACH') {
   try {
      await useNuxtApp().$api(`/property/${propertyId}/feature`, {
         method: state === 'ATTACH' ? 'PUT' : 'DELETE',
         body: {
            featureId: feature.id,
         },
      });
   }
   catch (error) {
      console.error(error);
   }
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 cursor-pointer">
      <div
         v-for="feature in apiFeatures.features"
         :key="feature.id"
         class="toggle-btn"
         :class="isSelected(feature) ? 'bg-first-100' : 'bg-first-50/50 text-black'"
         @click="toggleFeature(feature)"
      >
         <p>{{ feature.feature }}</p>
      </div>
   </div>
</template>

<style scoped lang="postcss">
.toggle-btn {
   @apply rounded-xl px-4 py-2 leading-none;
   @apply hover:bg-first-100 hover:text-black;
   @apply cursor-pointer transition-all;
}
</style>
