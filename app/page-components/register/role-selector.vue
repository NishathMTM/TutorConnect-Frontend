<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';

const modelValue = defineModel<string>({ default: 'STUDENT' });

const options = [
   { value: 'STUDENT', label: 'student', icon: 'i-fluent:person-note-20-regular' },
   { value: 'TEACHER', label: 'teacher', icon: 'i-fluent:person-home-20-regular' },

];
</script>

<template>
   <RadioGroup v-model="modelValue">
      <div class="grid grid-cols-2 gap-5">
         <div
            v-for="option in options"
            :key="option.value"
            class=""
         >
            <RadioGroupOption
               v-slot="{ checked }"
               :value="option.value"
            >
               <div class="p-3 rounded-xl cursor-pointer" :class="checked ? 'bg-first-300 text-white' : 'bg-first-50'">
                  <div class="text-center uppercase text-sm" :class="checked ? '' : 'text-first-300'">
                     {{ option.label }}
                  </div>
                  <div class="flex items-center justify-center w-full">
                     <UIcon :name="option.icon" class="size-6 lg:size-8" :class="checked ? 'text-white/80' : 'text-first-300'" />
                  </div>
               </div>
            </RadioGroupOption>
         </div>
      </div>
   </RadioGroup>
</template>

<style scoped lang="postcss"></style>
