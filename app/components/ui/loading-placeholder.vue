<script setup lang="ts">

</script>

<template>
   <div class="flex w-full justify-center p-10">
      <span class="loader"></span>
   </div>
</template>

<style lang="postcss">
.loader{
   display: block;
   position: relative;
   height: 16px;
   border: 2px solid #e3e6f6;
   width: 140px;
   background: #e3e6f6;
   box-sizing: border-box;
}
.loader:before{
   content: '';
   position: absolute;
   left: 0;
   bottom: 0px;
   width: 12px;
   height: 12px;
   background: #acb8e4;
   animation: ballbns 1s ease-in-out infinite alternate;
}

@keyframes ballbns {
   0% {  left: 0; transform: translateX(0%); }
   100% {  left: 100%; transform: translateX(-100%); }
}
</style>
