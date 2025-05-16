/**
 * Returns the api url base
 */
export function getApiBaseURL() {
   const config = useRuntimeConfig();
   return config.public.apiBaseUrl;
}
