<script setup lang="ts">
import { watchImmediate } from '@vueuse/shared';
import dayjs from 'dayjs';

/* ---------------------------------------------------------------------------------------------- */

const props = defineProps<{
   allowFuture?: boolean;
   denyPast?: boolean;
}>();

/* ---------------------------------------------------------------------------------------------- */

const modelValue = defineModel<string>({
   default: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
});

// Split the ISO datetime into date and time components
const date = ref(dayjs(modelValue.value).format('YYYY-MM-DD'));
const time = ref(dayjs(modelValue.value).format('HH:mm:ss'));

// Combine date and time into ISO format
const dateTimeValue = computed(() => {
   return `${date.value}T${time.value}`;
});

// Watch for changes in the computed datetime value
watch(dateTimeValue, (newValue) => {
   modelValue.value = newValue;
});

// Watch for external changes to the model value
watchImmediate(modelValue, (newValue) => {
   if (newValue) {
      date.value = dayjs(newValue).format('YYYY-MM-DD');
      time.value = dayjs(newValue).format('HH:mm:ss');
   }
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex gap-2">
      <div class="flex-1">
         <InputDatepicker
            v-model="date"
            :allow-future="props.allowFuture"
            :deny-past="props.denyPast"
         />
      </div>
      <div class="w-[200px]">
         <InputTime v-model="time" />
      </div>
   </div>
</template>
