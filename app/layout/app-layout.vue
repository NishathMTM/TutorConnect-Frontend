<script setup lang="ts">
import Logo from 'assets/logo.vue';
import UserWidget from '~/components/user/user-widget.vue';

const showSidebar = ref(false);

function toggleSidebar() {
   showSidebar.value = !showSidebar.value;
}
</script>

<template>
   <div class="flex h-screen">
      <!-- region: sidebar -->
      <aside
         class="fixed z-20 flex h-screen w-72 shrink-0 flex-col bg-first-50 transition-all duration-100 xl:relative shadow-lg border-r border-r-first-200"
         :class="[showSidebar ? 'translate-x-0' : '-translate-x-full xl:translate-x-0']"
      >
         <div class="flex justify-center border-b border-first-200 py-3 h-16">
            <NuxtLink to="/">
               <Logo class="h-6" />
            </NuxtLink>
         </div>

         <div class="flex-1 overflow-auto p-2">
            <!-- region: sidebar content -->
            <section class="overflow-auto">
               <slot name="sidebar" />
            </section>
            <!-- endregion: sidebar content -->
         </div>
      </aside>
      <!-- endregion: sidebar -->

      <div
         v-if="showSidebar"
         class="fixed z-10 h-screen w-screen bg-second-100/50 backdrop-blur"
         @click="showSidebar = false"
      />

      <!-- region: main -->
      <main class="flex w-full flex-1 flex-col overflow-auto">
         <section class="overflow-auto flex flex-col h-full">
            <!-- region: header -->
            <header class="flex shrink-0 justify-between items-center gap-5 bg-first-50 px-5 h-16 py-3 border-b border-first-200">
               <div>
                  <UButton
                     class="xl:hidden"
                     icon="i-uil:bars"
                     variant="soft"
                     @click="toggleSidebar()"
                  />
               </div>
               <UserWidget />
            </header>
            <!-- endregion: header -->

            <div class="p-5 flex-1">
               <slot />
            </div>

            <footer class="mt-10">
               <div class="text-center text-sm text-second-400">
                  <div class="w-full border-b border-first-200" />
                  <div class="my-5 flex items-center justify-center">
                     <UIcon name="i-ic:baseline-copyright" /> {{ new Date().getFullYear() }} Tutor Connect. All rights reserved.
                  </div>
               </div>
            </footer>
         </section>
      </main>
      <!-- endregion: main -->
   </div>
</template>

<style scoped lang="postcss"></style>
