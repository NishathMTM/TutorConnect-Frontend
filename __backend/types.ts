import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

export const PaginationMetaSchema = z.object({
   total: z.number(),
   perPage: z.number(),
   firstPage: z.number(),
   lastPage: z.number(),
   currentPage: z.number(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export interface PaginatedResponse {
   data: any;
   meta: PaginationMeta;
}
