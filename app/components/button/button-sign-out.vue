<script setup lang="ts">
import { iconLibrary } from '~/utils/icons-utils';

const { clear } = useUserSession();

async function signOut() {
   await clear();
   navigateTo('/');
}
</script>

<template>
   <UButton
      color="gray"
      :icon="iconLibrary.auth.signOut"
      @click="signOut()"
   >
      <slot>Sign out</slot>
   </UButton>
</template>

<style scoped lang="postcss"></style>