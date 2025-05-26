<script setup lang="ts">
import type { CourseListing } from '~~/__backend/course-listings/types';
import CourseOverviewItem from '~/components/course/course-overview-item.vue';

/* ---------------------------------------------------------------------------------------------- */

const { listing } = defineProps<{
   listing: CourseListing;
}>();

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section>
      <div class="mb-3 flex flex-col items-center justify-between lg:flex-row">
         <Heading1 class="uppercase lg:mb-5">
            Listing details
         </Heading1>

         <aside>
            <ButtonEdit
               icon="i-fluent:edit-line-horizontal-3-20-regular"
               :to="`/app/teacher/course-listings/${listing.id}/edit`"
            >
               Edit listing details
            </ButtonEdit>
         </aside>
      </div>

      <!-- region: listing details -->
      <section class="flex flex-col gap-5">
         <div>
            <Heading3>{{ listing.title }}</Heading3>
         </div>

         <div>
            <heading4 class="mb-2">
               Class details
            </heading4>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
               <CourseOverviewItem title="Listing date">
                  {{ listing.listingDate }}
               </CourseOverviewItem>

               <CourseOverviewItem title="Available date">
                  {{ listing.availableFrom }}
               </CourseOverviewItem>

               <CourseOverviewItem title="Rent expectation">
                  {{ formatLKR(listing.hourlyRate) }}
               </CourseOverviewItem>
            </div>
         </div>

         <div>
            <Heading4 class="mb-2">
               Contact details
            </Heading4>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
               <CourseOverviewItem title="Contact phone">
                  {{ listing.contactPhone }}
               </CourseOverviewItem>

               <CourseOverviewItem title="Contact address">
                  {{ listing.contactAddress }}
               </CourseOverviewItem>

               <CourseOverviewItem title="Contact email">
                  {{ listing.contactEmail }}
               </CourseOverviewItem>
            </div>
         </div>

         <div>
            <Heading4 class="mb-2">
               Description
            </Heading4>
            <div class="whitespace-pre-wrap rounded-xl bg-second-50 p-2">
               {{ listing.description }}
            </div>
         </div>
      </section>

      <!-- endregion: listing details -->
   </section>
</template>

<style scoped lang="postcss"></style>
