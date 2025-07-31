<script setup lang="ts">
import PublicLayout from '~/layout/public-layout.vue';

/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /
 * Description: Homepage
 */

useAppTitle('Welcome');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <PublicLayout>
      <!-- region: body -->
      <section class="p-4 lg:p-0">
         <div class="flex w-full flex-col lg:flex-row lg:gap-5">
            <aside class="basis-2/5">
               <div class="mb-3 text-center font-bold text-first-500 lg:text-left">
                  Bridging the Gap Between Teaching and Learning.
               </div>

               <h4 class=" mt-5 mb-5 text-4xl justify-center font-bold text-primaryColor lg:text-3xl">
                  Experience the Future. Start Managing Your learning and teaching Smarter – Try Now!
               </h4>

               <div class="text-lg font-bold text-primaryColor">
                  "Stay Connected with Your Tutors simply Anytime, Anywhere"
               </div>

               <div class="mt-10 text-center lg:text-left">
                  <UButton
                     to="/register"
                     size="xl"
                     :ui="{
                        base: 'shadow-[0px_10px_17px_3px_#c3dafe] hover:shadow-[0px_10px_17px_3px_#a3bffa] transition-all',
                        font: 'font-black uppercase',
                        padding: {
                           xl: 'px-10',
                        },
                     }"
                  >
                     Register now
                  </UButton>
               </div>
            </aside>
            <!-- region: image -->
            <div class="mt-10 basis-3/5 lg:mt-0">
               <div class="max-h-[380px]">
                  <img
                     class="max-h-[380px] w-full rounded-xl object-cover drop-shadow"
                     src="/img.png"
                     alt=""
                  >
               </div>
            </div>
            <!-- endregion: image -->
         </div>
      </section>
      <!-- endregion: body -->

      <!-- region: property listings -->
      <div class="mt-10 p-4 lg:p-0">
         <header class="mb-5">
            <Heading1>Recently listed Classes</Heading1>
         </header>

         <PublicCourseListings />

         <footer class="mt-5 flex justify-center">
            <NuxtLink
               class="text-lg font-bold uppercase text-first-600 hover:text-first-700"
               to="/public/listings"
            >
               Check out more listings
            </NuxtLink>
         </footer>
      </div>
      <!-- endregion: property listings -->
   </PublicLayout>
</template>

<style lang="postcss"></style>
