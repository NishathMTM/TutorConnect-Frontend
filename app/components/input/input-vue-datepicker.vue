<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import { watchImmediate } from '@vueuse/shared';
import dayjs from 'dayjs';

/* ---------------------------------------------------------------------------------------------- */

const { allowFuture = false } = defineProps<{
   allowFuture?: boolean;
   denyPast?: boolean;
}>();

/* ---------------------------------------------------------------------------------------------- */

const modelDateValue = defineModel<string>({ default: dayjs().format('YYYY-MM-DD') });

const date = ref(dayjs(modelDateValue.value).toDate());

watch(date, (date) => {
   modelDateValue.value = toDateString(date);
});

watchImmediate(modelDateValue, (modelDate) => {
   date.value = dayjs(modelDate).toDate();
});
</script>

<template>
   <VueDatePicker
      v-model="date"
      auto-apply
      auto-position
      :enable-time-picker="false"
      :clearable="false"
      :max-date="allowFuture ? undefined : new Date()"
      :min-date="denyPast ? new Date() : undefined"
   />
</template>

<style lang="postcss">
:root {
   --vc-font-family: 'Geist', sans-serif;
}
</style>
