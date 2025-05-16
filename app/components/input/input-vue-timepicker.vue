<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/* ---------------------------------------------------------------------------------------------- */

// const { allowFuture = false } = defineProps<{
//    allowFuture?: boolean;
//    denyPast?: boolean;
// }>();

/* ---------------------------------------------------------------------------------------------- */

const modelTimeValue = defineModel<string>({ default: '13:15:00' });

const time = ref({
   hours: new Date().getHours(),
   minutes: new Date().getMinutes(),
});

/*
 * when local time ref is changed, update the model value that goes out
 */
watch(time, ({ hours, minutes }) => {
   const timeComponent = dayjs().set('hours', hours).set('minutes', minutes);
   modelTimeValue.value = `${timeComponent.format('HH:mm')}:00`;
});

/*
 * when a model value is changed from outside, update the time ref
 */
watchImmediate(modelTimeValue, (modelTime) => {
   const timeComponents = dayjs(modelTime, 'HH:mm');

   time.value.hours = timeComponents.hour();
   time.value.minutes = timeComponents.minute();
});
</script>

<template>
   <VueDatePicker
      v-model="time"
      auto-apply
      auto-position
      :enable-time-picker="false"
      :clearable="false"
      time-picker
      :is24="false"
   />
</template>

<style lang="postcss">
:root {
   --vc-font-family: 'Geist', sans-serif;
}
</style>
