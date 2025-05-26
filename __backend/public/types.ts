// import { z } from 'zod';
// import {
//    PropertyImageSchema,
//    PropertyTypeSchema,
// } from '~~/__backend/course/types';
// import { PropertyFeatureSchema } from '~~/__backend/property-features/types';
//
// /* ---------------------------------------------------------------------------------------------- */
//
// export const PublicPropertyInfoSchema = z.object({
//    id: z.number(),
//    ownerId: z.number(),
//    propertyTypeId: z.number(),
//    address: z.string(),
//    cityId: z.number(),
//    street: z.string(),
//    description: z.string(),
//    rooms: z.number(),
//    floorArea: z.number(),
//    bathrooms: z.number(),
//    floors: z.number(),
//    lat: z.number(),
//    lng: z.number(),
//    carParkingCapacity: z.number(),
//    bikeParkingCapacity: z.number(),
//    furnishedState: z.enum(['FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']),
//    propertyType: PropertyTypeSchema,
//    propertyFeatures: z.array(PropertyFeatureSchema),
//    propertyImages: z.array(PropertyImageSchema),
//    primaryImage: PropertyImageSchema.nullable(),
//    user: z.object({
//       id: z.number(),
//       email: z.string().email(),
//       profile: z.object({
//          fullName: z.string(),
//          avatarUrl: z.string(),
//       }),
//    }),
//    city: z.object({
//       id: z.number(),
//       city: z.string(),
//    }),
// });
//
// export const PublicPropertyListingSchema = z.object({
//    id: z.number(),
//    propertyId: z.number(),
//    title: z.string(),
//    description: z.string().nullable(),
//    listingDate: z.string().date(),
//    availableFrom: z.string().date(),
//    tenancyLength: z.number(),
//    securityDeposit: z.coerce.number(),
//    rentExpectation: z.coerce.number(),
//    property: PublicPropertyInfoSchema,
// });
//
// export const PublicPropertyListingListSchema = z.array(PublicPropertyListingSchema);
//
// export type PublicPropertyListing = z.infer<typeof PublicPropertyListingSchema>;
// export type PublicPropertyInfo = z.infer<typeof PublicPropertyInfoSchema>;
