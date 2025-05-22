<script setup lang="ts">
import type { ApiGetAllCoursesByTeacherQuery } from '~~/__backend/courses/api';
import PageHeader from '~/components/wrappers/page-header.vue';

/* ---------------------------------------------------------------------------------------------- */

const modelQueryParams = defineModel<ApiGetAllCoursesByTeacherQuery>('query', {
   default: {
      ownerId: 0,
      courseCategoryId: undefined,
      courseTypeId: undefined,
      query: undefined,
   },
});

const queryParams = reactive({} as ApiGetAllCoursesByTeacherQuery);

/* ---------------------------------------------------------------------------------------------- */

queryParams.courseCategoryId = modelQueryParams.value.courseCategoryId;
//
// watchDeep(queryParams, (params) => {
//    if (params.courseCategoryId !== '') {
//       modelQueryParams.value.courseCategoryId = params.courseCategoryId;
//    }
//    else {
//       modelQueryParams.value.courseCategoryId = undefined;
//    }
// });
//
// function apply() {
//    if (queryParams.query !== '') {
//       modelQueryParams.value.query = queryParams.query;
//    }
//    else {
//       modelQueryParams.value.query = undefined;
//    }
// }
//
// /* ---------------------------------------------------------------------------------------------- */
//
// const canReset = computed(() => {
//    if (modelQueryParams.value.courseCategoryId !== undefined) {
//       return true;
//    }
//    return modelQueryParams.value.courseTypeId !== undefined;
// });
//
// function reset() {
//    modelQueryParams.value.courseCategoryId = undefined;
//    modelQueryParams.value.query = undefined;
//    modelQueryParams.value.courseTypeId = undefined;
// }

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <PageHeader>
      <!-- region: left -->
      <section>
         <div class="flex flex-col gap-1 lg:flex-row">
            <InputCourseType
               v-model="modelQueryParams.courseTypeId"
               class="w-40"
            />

            <InputCourseCategory
               v-model="modelQueryParams.courseCategoryId"
               class="w-40"
            />

            <!--            <UPopover> -->
            <!--               <UButton -->
            <!--                  label="Filters" -->
            <!--                  color="gray" -->
            <!--                  icon="i-fluent:filter-24-regular" -->
            <!--               /> -->

            <!--               <template #panel> -->
            <!--                  <div class="flex flex-col gap-3 p-2"> -->
            <!--                     <div> -->
            <!--                        <UFormField label="Search query"> -->
            <!--                           <UInput v-model="queryParams.query" /> -->
            <!--                        </UFormField> -->
            <!--                     </div> -->

            <!--                     <footer class="flex justify-end"> -->
            <!--                        <UButton -->
            <!--                           icon="i-fluent:checkmark-24-regular" -->
            <!--                           @click="apply()" -->
            <!--                        > -->
            <!--                           Apply -->
            <!--                        </UButton> -->
            <!--                     </footer> -->
            <!--                  </div> -->
            <!--               </template> -->
            <!--            </UPopover> -->

            <!--            <ButtonCancel -->
            <!--               v-if="canReset" -->
            <!--               @click="reset()" -->
            <!--            > -->
            <!--               Reset -->
            <!--            </ButtonCancel> -->
         </div>
      </section>
      <!-- endregion: left -->

      <!-- region: right -->
      <div>
         <AddNewCourse1 />
      </div>
      <!-- endregion: right -->
   </PageHeader>
</template>

<style scoped lang="postcss"></style>
