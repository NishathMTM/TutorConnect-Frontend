<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import dayjs from 'dayjs';

/* ---------------------------------------------------------------------------------------------- */

const { allowFuture = false } = defineProps<{
   allowFuture?: boolean;
}>();

/* ---------------------------------------------------------------------------------------------- */

const modelDateValue = defineModel<string[]>({ default: [todayAsString(), todayAsString()] });

const date = ref([
   dayjs(modelDateValue.value[0]).toDate(),
   dayjs(modelDateValue.value[1]).toDate(),
]);

watch(date, ([startDate, endDate]) => {
   if (startDate && endDate) {
      modelDateValue.value = [toDateString(startDate), toDateString(endDate)];
   }
});
</script>

<template>
   <VueDatePicker
      v-model="date"
      auto-apply
      range
      auto-position
      :enable-time-picker="false"
      :clearable="false"
      :max-date="allowFuture ? undefined : new Date()"
   />
</template>

<style lang="postcss">

</style>
