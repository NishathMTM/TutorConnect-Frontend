<script setup lang="ts">
import type { CourseFeature } from '~~/__backend/course-features/types';
import { useApiGetAllCourseFeatures } from '~~/__backend/course-features/api';

/* ---------------------------------------------------------------------------------------------- */

const { courseId } = defineProps<{
   courseId: number;
}>();

const toast = useToast();

/* ---------------------------------------------------------------------------------------------- */

const apiFeatures = reactive(useApiGetAllCourseFeatures());
apiFeatures.execute();

/* ---------------------------------------------------------------------------------------------- */

const model = defineModel<CourseFeature[]>({ default: [] });

function toggleFeature(feature: CourseFeature) {
   if (!isSelected(feature)) {
      model.value.push(feature);

      handleClickFeature(feature, 'ATTACH');

      toast.add({
         title: 'Features',
         description: `${feature.feature} is attached to the course`,
         color: 'success',
      });
   }
   else {
      const index = model.value.findIndex(v => v.id === feature.id);
      model.value.splice(index, 1);
      handleClickFeature(feature, 'DETACH');

      toast.add({
         title: 'Features',
         description: `${feature.feature} is removed from the course`,
         color: 'error',
      });
   }
}

function isSelected(feature: CourseFeature) {
   return model.value.find(f => f.id === feature.id);
}

/* ---------------------------------------------------------------------------------------------- */

async function handleClickFeature(feature: CourseFeature, state: 'ATTACH' | 'DETACH') {
   try {
      await useNuxtApp().$api(`/course/${courseId}/feature`, {
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
   <div class="course-features">
      <p class="text-sm text-second-500 mb-3">
         Click on features to add or remove them from your course
      </p>

      <div v-if="apiFeatures.status === 'pending'" class="flex justify-center py-4">
         <UIcon name="i-heroicons-arrow-path" class="animate-spin text-first-500 size-8" />
      </div>

      <div v-else-if="apiFeatures.features.length === 0" class="text-center py-4 text-second-400">
         No features available
      </div>

      <div v-else class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
         <div
            v-for="feature in apiFeatures.features"
            :key="feature.id"
            class="feature-btn"
            :class="[
               isSelected(feature)
                  ? 'bg-first-500 text-white border-first-500'
                  : 'bg-first-50 text-second-700 border-first-100',
            ]"
            @click="toggleFeature(feature)"
         >
            <div class="flex items-center gap-2">
               <UIcon
                  v-if="feature.icon"
                  :name="feature.icon"
                  class="size-5"
               />
               <UIcon
                  v-else-if="isSelected(feature)"
                  name="i-heroicons-check-circle"
                  class="size-5"
               />
               <UIcon
                  v-else
                  name="i-heroicons-plus-circle"
                  class="size-5"
               />
               <span>{{ feature.feature }}</span>
            </div>
         </div>
      </div>

      <div class="mt-4 flex items-center gap-2">
         <div class="flex items-center gap-1">
            <div class="size-4 rounded-full bg-first-500" />
            <span class="text-xs text-second-500">Selected</span>
         </div>
         <div class="flex items-center gap-1">
            <div class="size-4 rounded-full bg-first-50 border border-first-100" />
            <span class="text-xs text-second-500">Available</span>
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss">
.feature-btn {
   @apply rounded-2xl px-4 py-3 border;
   @apply flex items-center justify-start;
   @apply cursor-pointer transition-all duration-200;
   @apply hover:shadow-md;
}

.feature-btn:hover {
   @apply transform -translate-y-0.5;
}

.course-features {
   @apply p-6 rounded-2xl border border-first-100 bg-white shadow-sm;
}
</style>
