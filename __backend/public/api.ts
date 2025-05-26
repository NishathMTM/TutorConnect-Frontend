// import type { PublicPropertyListing } from '~~/__backend/public/types';
// import type { PaginatedResponse } from '~~/__backend/types';
// import {
//    PublicPropertyListingListSchema,
//    PublicPropertyListingSchema,
// } from '~~/__backend/public/types';
// import { useApiPagination } from '~~/__backend/use-api-pagination';
// import { useApiFetch } from '~/composables/use-api-fetch';
//
// /* ---------------------------------------------------------------------------------------------- */
//
// /**
//  * Get all public property listings
//  */
// export interface PublicGetActivePropertiesQuery {
//    page: number;
//    perPage: number;
//    cityId?: number;
//    propertyTypeId?: number;
//    minRentExpectation?: number;
//    maxRentExpectation?: number;
// }
// export function usePublicApiGetActiveProperties(query: PublicGetActivePropertiesQuery) {
//    const { data, error, execute, status } = useApiFetch<PaginatedResponse>(
//       `/public/property-listing`,
//       {
//          query,
//       },
//    );
//
//    const listings = computed<PublicPropertyListing[]>(() => {
//       if (!error.value && data.value) {
//          return PublicPropertyListingListSchema.parse(data.value.data);
//       }
//       return [];
//    });
//
//    const { pagination } = useApiPagination(data, error);
//
//    return {
//       pagination,
//       listings,
//       error,
//       status,
//       execute,
//    };
// }
//
// /* ---------------------------------------------------------------------------------------------- */
//
// /**
//  * Get single public property listing
//  */
//
// export function usePublicApiGetPropertyListing(listingId: Ref<number>) {
//    const { data, error, execute, status } = useApiFetch<PaginatedResponse>(
//       () => `/public/property-listing/${listingId.value}`,
//    );
//
//    const listing = computed<PublicPropertyListing | null>(() => {
//       if (!error.value && data.value) {
//          return PublicPropertyListingSchema.parse(data.value);
//       }
//       return null;
//    });
//
//    return {
//       listing,
//       error,
//       status,
//       execute,
//    };
// }
