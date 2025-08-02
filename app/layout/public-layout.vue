<script setup lang="ts">
import Logo from 'assets/logo.vue';
import dayjs from 'dayjs';
import ButtonSignOut from '~/components/button/button-sign-out.vue';
import UserWidget from '~/components/user/user-widget.vue';

/* ---------------------------------------------------------------------------------------------- */

const { loggedIn } = useUserSession();

const mainLinks = [
   { link: '/', label: 'Home' },
   { link: '/', label: 'About' },
   { link: '/', label: 'Contact' },
   { link: '/public/listings', label: 'Listings', classNames: 'main-nav-link-special' },

];

const isOpen = ref(false);

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex min-h-screen flex-col lg:px-5">
      <!-- region: header -->
      <header class="mb-5 border-b lg:my-5">
         <div class="container mx-auto my-5">
            <div class="flex w-full flex-col items-center justify-between lg:flex-row">
               <!-- region: aside-left -->
               <aside class="flex w-full shrink items-center px-4 lg:w-auto lg:px-0">
                  <div class="flex-1">
                     <Logo class="w-48" />
                  </div>

                  <div class="lg:hidden">
                     <UButton
                        icon="i-fluent:list-rtl-16-filled"
                        variant="soft"
                        color="info"
                        size="xl"
                        @click="isOpen = true"
                     />

                     <USlideover v-model="isOpen">
                        <div class="flex flex-1 flex-col p-4">
                           <UButton
                              class="absolute end-5 top-5 z-10 flex sm:hidden"
                              color="info"
                              variant="ghost"
                              size="sm"
                              icon="i-fluent:dismiss-16-regular"
                              square
                              padded
                              @click="isOpen = false"
                           />
                           <div class="mt-20 flex flex-1 flex-col gap-5">
                              <NuxtLink
                                 v-for="(item, index) in mainLinks"
                                 :key="index"
                                 class="text-2xl uppercase text-first-500"
                                 :to="item.link"
                              >
                                 {{ item.label }}
                              </NuxtLink>
                           </div>

                           <div class="flex flex-col justify-center gap-1 mb-5">
                              <div class="flex justify-center">
                                 <UButton
                                    variant="soft"
                                    to="/app"
                                 >
                                    Dashboard
                                 </UButton>
                              </div>

                              <UserWidget />

                              <div v-if="loggedIn" class="flex justify-center mt-2">
                                 <ButtonSignOut />
                              </div>
                           </div>

                           <div class="flex w-full items-center justify-center">
                              <Logo class="w-48" />
                           </div>
                        </div>
                     </USlideover>
                  </div>
               </aside>
               <!-- endregion: aside-left -->

               <!-- region: menu -->
               <nav class="hidden gap-10 lg:flex">
                  <NuxtLink
                     v-for="(item, index) in mainLinks"
                     :key="index"
                     class="main-nav-link"
                     :class="item.classNames"
                     :to="item.link"
                  >
                     {{ item.label }}
                  </NuxtLink>
               </nav>
               <!-- endregion: menu -->

               <!-- region: aside-right -->
               <aside
                  v-if="!loggedIn"
                  class="hidden items-center lg:flex"
               >
                  <UButton
                     class="uppercase"
                     to="/login"
                  >
                     Login
                  </UButton>
               </aside>
               <aside
                  v-else
                  class="hidden items-center justify-center gap-2 lg:flex"
               >
                  <UButton
                     variant="soft"
                     to="/app"
                  >
                     Dashboard
                  </UButton>

                  <UserWidget />

                  <ButtonSignOut />
               </aside>
               <!-- endregion: aside-right -->
            </div>
         </div>
      </header>
      <!-- endregion: header -->

      <main class="container mx-auto  min-h-full flex-1">
         <slot />
      </main>

      <footer class="container mx-auto mt-10">
         <div class="w-full border-t border-first-50" />

         <div class="p-5 text-second-400 lg:px-0 lg:py-5 text-sm uppercase">
            <div class="flex items-center justify-between">
               <div class="flex items-center">
                  <UIcon name="i-ic:baseline-copyright" />
                  <div>{{ dayjs().format('YYYY') }} Tutor Connect. All rights reserved.</div>
               </div>
            </div>
         </div>
      </footer>
   </div>
</template>

<style scoped lang="postcss">
.main-nav-link {
   @apply text-sm font-bold uppercase text-primaryColor;
   @apply hover:text-first-500;
}

.main-nav-link-special {
   @apply text-sm font-bold uppercase text-first-500;
   @apply hover:text-first-600;
}

.mobile-nav {
   @apply flex flex-col items-center justify-center gap-10;

   & .main-nav-link {
      @apply text-xl font-bold uppercase text-first-500;
      @apply hover:text-first-700;
   }
}
</style>
