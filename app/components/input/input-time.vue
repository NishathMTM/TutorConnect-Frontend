<script setup lang="ts">
import dayjs from 'dayjs';

/* ---------------------------------------------------------------------------------------------- */

const { minutesStep = 5 } = defineProps<{
   minutesStep?: number;
}>();

/* ---------------------------------------------------------------------------------------------- */

const model24h = defineModel({ default: timeAsString() });

/* ---------------------------------------------------------------------------------------------- */

const hourOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const minutesOptions: string[] = [];
const amPmOptions = ['AM', 'PM'];

for (let i = 0; i < 60; i += minutesStep) {
   minutesOptions.push(i.toString().padStart(2, '0'));
}

/* ---------------------------------------------------------------------------------------------- */

const hour = ref();
const minute = ref();
const amPm = ref();

watch(
   model24h,
   (value24h) => {
      /*
       * Creating 12h format using dayjs and then splitting them
       * output: 14:00 => 02|00|PM
       */
      const [hourPart, minutePart, amPmPart] = dayjs(`1970-01-01 ${value24h}`)
         .format('h|mm|A')
         .split('|');

      /*
       * Assigning each part to the input fields
       */
      hour.value = hourPart;
      minute.value = minutePart;
      amPm.value = amPmPart;
   },
   { immediate: true },
);

watchEffect(() => {
   /*
    * Watch for any of the input and build 24h format time using
    * dayjs
    * output: 1970-01-01 02:40 PM => 14:40
    */
   model24h.value = dayjs(`1970-01-01 ${hour.value}:${minute.value} ${amPm.value}`)
      .format('HH:mm:ss');
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex gap-1">
      <div>
         <USelectMenu
            v-model="hour"
            class="min-w-[4.5rem]"
            :items="hourOptions"
            :portal="false"
         />
      </div>

      <div>
         <USelectMenu
            v-model="minute"
            :items="minutesOptions"
         />
      </div>

      <div>
         <USelectMenu
            v-model="amPm"
            :items="amPmOptions"
         />
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
