import { Transmit } from '@adonisjs/transmit-client';

/**
 * Plugin to register Adonis' Transmit Client
 * https://docs.adonisjs.com/guides/digging-deeper/transmit#transmit-client
 */
export default defineNuxtPlugin(() => {
   const runtimeConfig = useRuntimeConfig();

   const transmit = new Transmit({
      baseUrl: runtimeConfig.public.apiBaseUrl,
   });

   return {
      provide: {
         transmit,
      },
   };
});
