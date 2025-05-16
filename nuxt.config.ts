// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
   $env: undefined,
   compatibilityDate: '2024-11-01',
   devtools: { enabled: true },
   future: {
      compatibilityVersion: 4,
   },
   css: ['~/assets/css/main.css'],
   vite: {
      plugins: [
         tailwindcss(),
      ],
   },

   modules: [
      '@nuxt/eslint',
      '@nuxt/fonts',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxt/scripts',
      '@nuxt/ui',
      '@pinia/nuxt',
      'nuxt-auth-utils',
      'dayjs-nuxt',
   ],

   ui: {
      colorMode: false,
   },

   eslint: {
      config: {

         standalone: false,

      },
   },

   components: [
      { path: '~/layout', pathPrefix: false },
      { path: '~/page-components', pathPrefix: false },
      { path: '~/components', pathPrefix: false },
      { path: '~/components/ui', pathPrefix: false },
   ],

   // fonts: {
   //    families: {
   //       Sora: [400, 500, 600, 700, 800],
   //    },
   //    prefetch: true,
   //    preconnect: true,
   // },

   runtimeConfig: {
      public: {
         apiBaseUrl: '',
      },
   },
   build: {
      transpile: ['@vuepic/vue-datepicker'],
   },

});
