<script setup lang="ts">
import { usePublicApiGetTeacher } from '~~/__backend/public/api';

const { teacherId } = defineProps<{
   teacherId: number;
}>();

const apiTeacher = reactive(usePublicApiGetTeacher(ref(teacherId)));

watch(() => teacherId, (newTeacherId) => {
   if (newTeacherId > 0) {
      apiTeacher.execute();
   }
}, { immediate: true });
</script>

<template>
   <section v-if="apiTeacher.teacher" class="bg-white rounded-xl p-6 shadow-sm">
      <h2 class="text-xl font-bold text-second-800 mb-4">
         About the Teacher
      </h2>
      <div class="flex items-start gap-4">
         <UAvatar
            :alt="apiTeacher.teacher.profile.fullName"
            size="xl"
            class="flex-shrink-0"
         />
         <div class="flex-1">
            <h3 class="text-lg font-semibold text-second-800 mb-2">
               {{ apiTeacher.teacher.profile.fullName }}
            </h3>
            <div class="space-y-2 text-sm text-second-600">
               <div class="flex items-center gap-2">
                  <UIcon name="i-fluent:mail-24-regular" class="size-4" />
                  <span>{{ apiTeacher.teacher.email }}</span>
               </div>
               <div class="flex items-center gap-2">
                  <UIcon name="i-fluent:phone-24-regular" class="size-4" />
                  <span>{{ apiTeacher.teacher.profile.phone1 }}</span>
               </div>
               <div class="flex items-center gap-2">
                  <UIcon name="i-fluent:location-24-regular" class="size-4" />
                  <span>{{ apiTeacher.teacher.profile.address }}</span>
               </div>
            </div>
         </div>
      </div>
   </section>

   <!-- Loading state -->
   <section v-else-if="apiTeacher.status === 'pending'" class="bg-white rounded-xl p-6 shadow-sm">
      <h2 class="text-xl font-bold text-second-800 mb-4">
         About the Teacher
      </h2>
      <div class="flex items-start gap-4">
         <USkeleton class="size-16 rounded-full" />
         <div class="flex-1 space-y-2">
            <USkeleton class="h-6 w-1/3" />
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-4 w-1/2" />
            <USkeleton class="h-4 w-3/4" />
         </div>
      </div>
   </section>
</template>

<style scoped lang="postcss"></style>
