export default defineNuxtPlugin(async (nuxtApp) => {
   const { session, clear } = useUserSession();

   const runtimeConfig = useRuntimeConfig();

   const api = $fetch.create({
      baseURL: runtimeConfig.public.apiBaseUrl,

      onRequest({ options }) {
         if (session.value && session.value.token) {
            let headers = {};

            if ('headers' in options) {
               headers = options.headers;
            }

            if (Array.isArray(headers)) {
               headers.push(['Authorization', `Bearer ${session.value.token}`]);
            }
            else if (headers instanceof Headers) {
               headers.set('Authorization', `Bearer ${session.value.token}`);
            }
            else {
               headers = {
                  ...headers,
                  Authorization: `Bearer ${session.value.token}`,
               };
            }

            options.headers = <Headers>headers;
         }
      },

      async onResponseError({ response }) {
         if (response.status === 401) {
            await clear();
            await nuxtApp.runWithContext(() => navigateTo('/login'));
         }
      },
   });

   return {
      provide: {
         api,
      },
   };
});
