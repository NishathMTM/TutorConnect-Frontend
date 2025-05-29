import { PaginationMetaSchema } from '~~/__backend/types';

export function useApiPagination(data: any, error: any) {
   const pagination = computed(() => {
      if (!error.value && data.value) {
         return PaginationMetaSchema.parse(data.value.meta);
      }
   });

   return {
      pagination,
   };
}
