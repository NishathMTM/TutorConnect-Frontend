<script setup lang="ts">
import { useApiGetPropertyDetails } from '~~/__backend/properties/api';
import { useApiGetPropertyListing } from '~~/__backend/property-listings/api';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-landlord'],
});

/* ---------------------------------------------------------------------------------------------- */

const { listingId } = useRoute().params;

const listingIdRef = ref(Number(listingId));
const propertyIdRef = ref(0);

/* ---------------------------------------------------------------------------------------------- */

const apiListing = reactive(useApiGetPropertyListing(listingIdRef));
apiListing.execute();

/* ---------------------------------------------------------------------------------------------- */

const apiProperty = reactive(useApiGetPropertyDetails(propertyIdRef));

watch(() => apiListing.listing, (listing) => {
   if (listing) {
      propertyIdRef.value = listing.propertyId;
      apiProperty.execute();
   }
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /app/landlord/properties/[id]/listings/[listingId]
 * Description: View single property listing details
 */

useAppTitle('Listing details');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <LandlordLayout>
      <div v-if="apiListing.status === 'pending'">
         <LoadingPlaceholder />
      </div>

      <div v-if="apiListing.listing">
         <!-- region: Listing details -->
         <section>
            <PropertyListingCard :listing="apiListing.listing" />
         </section>
         <!-- endregion: Listing details -->

         <!-- region: Listing message -->
         <section></section>
         <!-- endregion: Listing message -->
      </div>

      <UDivider class="my-10 uppercase" label="Property details" />

      <div v-if="apiProperty.property">
         <SinglePropertyInfo :property="apiProperty.property" />
      </div>
   </LandlordLayout>
</template>

<style scoped lang="postcss"></style>
