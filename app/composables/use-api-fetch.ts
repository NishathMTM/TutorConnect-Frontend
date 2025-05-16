// import type { UseFetchOptions } from '#app';
//
// /**
//  * Custom API fetch composable that wraps useFetch with predefined options
//  * @param url The URL to fetch from
//  * @param options Additional fetch options
//  * @returns AsyncData instance from useFetch
//  */
// export function useApiFetch<T>(url: string | (() => string), options?: UseFetchOptions<T>) {
//    return useFetch<T>(url, {
//       immediate: false,
//       $fetch: useNuxtApp().$api as typeof $fetch,
//       ...options,
//    });
// }
