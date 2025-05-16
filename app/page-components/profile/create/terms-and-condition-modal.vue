<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
   <div>
      <UModal
         v-model="isOpen"
         title="Read Terms and conditions"
         description="Read the terms and conditions before proceeding.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab debitis earum error, -->
                 cumque eos illum maxime minima natus numquam perferendis"
      >
         <UButton label="Read Terms and conditions" color="primary" variant="link" />

         <template #content>
            <Placeholder class="h-48 m-4" />
         </template>
      </UModal>
   </div>
<!--   <div> -->
<!--      <UButton -->
<!--         class="text-sm text-first-600" -->
<!--         variant="link" -->
<!--         @click="isOpen = true" -->
<!--      > -->
<!--         Read out terms and conditions. -->
<!--      </UButton> -->

<!--      <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-[700px]' }"> -->
<!--         <UCard> -->
<!--            <template #header> -->
<!--               <Heading1>Terms & conditions</Heading1> -->
<!--            </template> -->

<!--            <section> -->
<!--               <p> -->
<!--                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab debitis earum error, -->
<!--                  harum itaque odit ullam vero! Accusamus, aliquid assumenda beatae consectetur -->
<!--                  cumque eos illum maxime minima natus numquam perferendis. -->
<!--               </p> -->

<!--               <p> -->
<!--                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet animi asperiores -->
<!--                  aspernatur atque, aut beatae consequuntur cum dicta dolorem dolorum eius eligendi -->
<!--                  eos et excepturi facilis harum hic inventore itaque iure, magnam maxime mollitia -->
<!--                  nihil nostrum odit provident quasi reiciendis reprehenderit sequi sint sunt unde -->
<!--                  ut voluptate. Ad assumenda at dolor dolores dolorum exercitationem fugiat iusto -->
<!--                  magnam nesciunt odit officia officiis optio, perferendis quam quo, tempora tenetur -->
<!--                  ullam, veniam! Eaque enim, maiores modi pariatur perferendis quam quas veniam -->
<!--                  voluptatibus. Assumenda atque debitis dolore doloribus earum exercitationem id -->
<!--                  ipsam perferendis quae reiciendis repellat temporibus, velit, vero. Ad aliquam -->
<!--                  aliquid aspernatur, at dignissimos doloremque est eum id impedit inventore ipsa -->
<!--                  libero necessitatibus neque nisi obcaecati odit pariatur provident quaerat quasi -->
<!--                  recusandae reiciendis repellendus reprehenderit sapiente sint sunt tempore ullam -->
<!--                  veritatis. Aperiam atque distinctio eos eum explicabo hic illo, libero, optio -->
<!--                  pariatur perspiciatis placeat quasi quia rem similique voluptates! Amet at commodi -->
<!--                  cum deleniti dolorem doloribus dolorum earum facilis illo, incidunt ipsa ipsum -->
<!--                  itaque, minus molestiae nisi nostrum nulla obcaecati officiis omnis pariatur -->
<!--                  perspiciatis praesentium recusandae rerum sequi soluta totam, ullam vel vero vitae -->
<!--                  voluptas. Aspernatur aut blanditiis debitis, ducimus enim excepturi illum ipsa -->
<!--                  libero modi qui quidem sed sequi ullam voluptatibus. -->
<!--               </p> -->

<!--               <p> -->
<!--                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet assumenda aut -->
<!--                  corporis dignissimos dolorem ducimus eaque esse fuga illum iure labore magnam -->
<!--                  molestias nesciunt non officiis optio quasi rem repellendus saepe, sequi soluta -->
<!--                  vel voluptas. A aperiam cupiditate eveniet, fugit, illum impedit ipsa magnam -->
<!--                  molestiae numquam provident, sapiente tempora. A fugit id nam quaerat! Alias fuga -->
<!--                  in ipsam! Consectetur deleniti eum id illum in laudantium nihil, nobis numquam -->
<!--                  obcaecati quam quidem recusandae sit vero? -->
<!--               </p> -->

<!--               <p> -->
<!--                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto aspernatur -->
<!--                  consequatur debitis, dolores enim et ex exercitationem ipsa numquam quibusdam -->
<!--                  repellendus repudiandae suscipit, ullam vel voluptate? Accusantium aliquid -->
<!--                  doloribus magnam quis! Animi corporis cumque delectus deserunt distinctio ea ipsam -->
<!--                  iusto labore magnam magni molestiae molestias necessitatibus non nulla possimus -->
<!--                  praesentium quaerat quam qui, quia recusandae tempore temporibus ullam veniam -->
<!--                  vitae voluptas? Aliquid aperiam deserunt ea eaque est nisi optio perspiciatis, -->
<!--                  recusandae repellat sit? Animi aut autem inventore ipsa iure, iusto nam optio. -->
<!--                  Autem, beatae blanditiis commodi distinctio et fuga impedit minima nihil nisi -->
<!--                  praesentium quae quibusdam quidem rem repellat sunt. -->
<!--               </p> -->
<!--            </section> -->

<!--            <template #footer> -->
<!--               <div class="flex justify-end"> -->
<!--                  <ButtonCancel @click="isOpen = false"> -->
<!--                     Close -->
<!--                  </ButtonCancel> -->
<!--               </div> -->
<!--            </template> -->
<!--         </UCard> -->
<!--      </UModal> -->
<!--   </div> -->
</template>

<style scoped lang="postcss"></style>
