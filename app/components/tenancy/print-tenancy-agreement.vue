<script setup lang="ts">
import type { Tenancy } from '~~/__backend/tenancy/types';

interface Props {
   tenancy: Tenancy;
}

const props = defineProps<Props>();

// Helper functions to format dates
function formatDate(dateString: string): { day: string; month: string; year: string } {
   const date = new Date(dateString);
   return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'long' }),
      year: date.getFullYear().toString(),
   };
}

// Format agreement date
const agreementDateFormatted = computed(() => {
   if (!props.tenancy.agreementDate)
      return { day: '___', month: '___', year: '20___' };
   return formatDate(props.tenancy.agreementDate);
});

// Format tenancy start date
const tenancyStartFormatted = computed(() => {
   if (!props.tenancy.tenancyStart)
      return { day: '___', month: '___', year: '20___' };
   return formatDate(props.tenancy.tenancyStart);
});

// Calculate tenancy end date
const tenancyEndFormatted = computed(() => {
   if (!props.tenancy.tenancyStart || !props.tenancy.tenancyDuration)
      return { day: '___', month: '___', year: '20___' };

   const startDate = new Date(props.tenancy.tenancyStart);
   const endDate = new Date(startDate);
   endDate.setMonth(endDate.getMonth() + props.tenancy.tenancyDuration);

   return formatDate(endDate.toISOString());
});

// Function to print the agreement
function printAgreement() {
   window.print();
}
</script>

<template>
   <div class="rent-agreement-container">
      <div class="print-controls">
         <UButton icon="i-heroicons-printer" @click="printAgreement">
            Print Agreement
         </UButton>
      </div>

      <div class="agreement-content">
         <h1 class="title">
            RENT AGREEMENT
         </h1>
         <p class="intro">
            This Rent Agreement is made and entered into on this {{ agreementDateFormatted.day }} day of {{ agreementDateFormatted.month }}, {{ agreementDateFormatted.year }}, in accordance with
            the Rent Act No. 7 of 1972 (as amended) and other applicable laws of Sri Lanka, by and
            between:
         </p>

         <h2>1. Parties</h2>
         <div class="party-section">
            <div class="party">
               <h3>Landlord:</h3>
               <div class="field">
                  <label>Name:</label>
                  <div class="input-field">
                     {{ tenancy.landlordName }}
                  </div>
               </div>
               <div class="field">
                  <label>Address:</label>
                  <div class="input-field">
                     {{ tenancy.landlordAddress }}
                  </div>
               </div>
               <div class="field">
                  <label>NIC/Passport No.:</label>
                  <div class="input-field">
                     {{ tenancy.landlordNic }}
                  </div>
               </div>
               <div class="field">
                  <label>Contact Number:</label>
                  <div class="input-field">
                     {{ tenancy.landlordPhone }}
                  </div>
               </div>
            </div>

            <div class="party">
               <h3>Tenant:</h3>
               <div class="field">
                  <label>Name:</label>
                  <div class="input-field">
                     {{ tenancy.tenantName }}
                  </div>
               </div>
               <div class="field">
                  <label>Address:</label>
                  <div class="input-field">
                     {{ tenancy.tenantAddress }}
                  </div>
               </div>
               <div class="field">
                  <label>NIC/Passport No.:</label>
                  <div class="input-field">
                     {{ tenancy.tenantNic }}
                  </div>
               </div>
               <div class="field">
                  <label>Contact Number:</label>
                  <div class="input-field">
                     {{ tenancy.tenantPhone }}
                  </div>
               </div>
            </div>
         </div>

         <h2>2. Property Details</h2>
         <p>The Landlord agrees to rent the following property to the Tenant:</p>
         <div class="field">
            <label>Type of Property:</label>
            <div class="input-field">
               {{ tenancy.typeOfProperty }}
            </div>
         </div>
         <div class="field">
            <label>Address:</label>
            <div class="input-field">
               {{ tenancy.propertyAddress }}
            </div>
         </div>
         <p>
            This agreement shall include the premises and any fixtures, fittings, or equipment as
            described in the attached inventory list (if applicable).
         </p>

         <h2>3. Duration of Lease</h2>
         <p>The lease term shall commence on {{ tenancyStartFormatted.day }}/{{ tenancyStartFormatted.month }}/{{ tenancyStartFormatted.year }} and:</p>
         <div class="field">
            <label>Be valid for a fixed period of</label>
            <div class="input-field">
               {{ tenancy.tenancyDuration }}
            </div>
            <label>months, expiring on {{ tenancyEndFormatted.day }}/{{ tenancyEndFormatted.month }}/{{ tenancyEndFormatted.year }} unless
               extended by mutual written agreement.</label>
         </div>
         <p>
            Continue on a month-to-month basis after the expiration of the fixed term until
            terminated by either party with at least one month's written notice.
         </p>

         <h2>4. Rent Payment</h2>
         <div class="field">
            <label>Monthly Rent: LKR</label>
            <div class="input-field">
               {{ tenancy.rentAmount }}
            </div>
         </div>
         <div class="field">
            <label>Payment Due Date: On or before the</label>
            <div class="input-field">
               {{ tenancy.rentDueDay }}
            </div>
            <label>day of each month.</label>
         </div>

         <template v-if="tenancy.rentMethod === 'BANK_TRANSFER'">
            <h3>Bank Details for Rent Payment:</h3>
            <div class="field">
               <label>Bank Name:</label>
               <div class="input-field">
                  {{ tenancy.bankName }}
               </div>
            </div>
            <div class="field">
               <label>Branch:</label>
               <div class="input-field">
                  {{ tenancy.bankBranch }}
               </div>
            </div>
            <div class="field">
               <label>Account Name:</label>
               <div class="input-field">
                  {{ tenancy.bankAccountName }}
               </div>
            </div>
            <div class="field">
               <label>Account Number:</label>
               <div class="input-field">
                  {{ tenancy.bankAccountNumber }}
               </div>
            </div>
         </template>

         <h2>5. Security Deposit</h2>
         <div class="field">
            <p>
               The Tenant shall pay a refundable security deposit of LKR {{ tenancy.securityDepositAmount }}, equivalent
               to {{ Math.round(tenancy.securityDepositAmount / tenancy.rentAmount) }} months' rent, upon signing this agreement.
            </p>
         </div>
         <p>The deposit will be refunded upon termination of this agreement, subject to deductions for:</p>
         <ul class="list">
            <li>Outstanding rent.</li>
            <li>Damages caused to the property (excluding reasonable wear and tear).</li>
            <li>Any unpaid utility bills.</li>
         </ul>
         <p>The Landlord must refund the deposit within 30 days after the Tenant vacates the property.</p>

         <h2>6. Utilities</h2>
         <p>Unless otherwise stated, the Tenant shall be responsible for the following utilities:</p>
         <ul class="list">
            <li>Electricity: [Tenant]</li>
            <li>Water: [Tenant]</li>
            <li>Internet: [Tenant]</li>
            <li>Other: ____________________</li>
         </ul>
         <p>
            The Landlord reserves the right to install separate meters for utility usage, and any disputes
            shall be resolved in accordance with Sri Lankan regulations.
         </p>

         <h2>7. Use of Property</h2>
         <ul class="list">
            <li>The Tenant shall use the property solely for residential purposes.</li>
            <li>
               Subletting, assigning, or parting with possession of the property is strictly prohibited
               unless written consent is obtained from the Landlord.
            </li>
            <li>
               The Tenant shall not engage in any illegal activity on the premises or disturb the
               peace of the neighborhood.
            </li>
         </ul>

         <h2>8. Maintenance and Repairs</h2>
         <ul class="list">
            <li>
               The Tenant must maintain the property in good condition and report any damages to
               the Landlord immediately.
            </li>
            <li>
               Minor repairs (e.g., light bulbs, plumbing leaks) shall be borne by the Tenant, while
               major structural repairs shall be the responsibility of the Landlord.
            </li>
            <li>
               The Tenant shall not make any alterations or additions to the property without prior
               written approval.
            </li>
         </ul>

         <h2>9. Termination</h2>
         <p>This agreement may be terminated under the following circumstances:</p>
         <ul class="list">
            <li>By mutual agreement.</li>
            <li>By either party providing at least one month's written notice.</li>
            <li>
               Immediately, by the Landlord, if the Tenant breaches any terms of this agreement or
               engages in unlawful activity.
            </li>
         </ul>
         <p>
            Upon termination, the Tenant must return the property in its original condition, along with all
            keys and fixtures provided.
         </p>

         <h2>10. Legal Provisions</h2>
         <ul class="list">
            <li>
               This agreement is governed by the laws of Sri Lanka, including the Rent Act No. 7
               of 1972.
            </li>
            <li>
               Any disputes arising from this agreement shall be referred to the Mediation Board or
               resolved through the courts of Sri Lanka.
            </li>
         </ul>

         <h2>11. Landlord's Access</h2>
         <p>
            The Landlord or their representative may access the property for inspections or repairs, with
            at least 24 hours' notice to the Tenant, except in emergencies.
         </p>

         <h2>12. Dispute Resolution</h2>
         <p>
            In the event of a dispute, the parties agree to first attempt to resolve it amicably. If
            unresolved, disputes shall be referred to the Mediation Board or the relevant district court.
         </p>

         <!-- Signature section -->
         <div class="signatures-and-witnesses">
            <!-- Main signatures -->
            <div class="signatures">
               <div class="signature-block">
                  <div class="signature-line">
                  </div>
                  <div class="signature-label">
                     Landlord's Signature
                  </div>
                  <div class="signature-date">
                     Date: ____________________
                  </div>
               </div>

               <div class="signature-block">
                  <div class="signature-line">
                  </div>
                  <div class="signature-label">
                     Tenant's Signature
                  </div>
                  <div class="signature-date">
                     Date: ____________________
                  </div>
               </div>
            </div>

            <!-- Witnesses -->
            <div class="witnesses">
               <div class="witness-block">
                  <h3>Witness 1:</h3>
                  <div class="witness-field">
                     <label>Name:</label>
                     <div class="signature-line">
                     </div>
                  </div>
                  <div class="witness-field">
                     <label>NIC:</label>
                     <div class="signature-line">
                     </div>
                  </div>
                  <div class="witness-field">
                     <label>Signature:</label>
                     <div class="signature-line">
                     </div>
                  </div>
               </div>

               <div class="witness-block">
                  <h3>Witness 2:</h3>
                  <div class="witness-field">
                     <label>Name:</label>
                     <div class="signature-line">
                     </div>
                  </div>
                  <div class="witness-field">
                     <label>NIC:</label>
                     <div class="signature-line">
                     </div>
                  </div>
                  <div class="witness-field">
                     <label>Signature:</label>
                     <div class="signature-line">
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss">
.rent-agreement-container {
   @apply max-w-4xl mx-auto p-8;
}

.print-controls {
   @apply mb-8 flex justify-end print:hidden;
}

.agreement-content {
   @apply space-y-6;
}

.title {
   @apply text-3xl font-bold text-center mb-8;
}

h2 {
   @apply text-xl font-semibold mt-6 mb-4;
}

h3 {
   @apply text-lg font-medium mb-3;
}

.party-section {
   @apply grid md:grid-cols-2 gap-8;
}

.field {
   @apply flex flex-wrap items-baseline gap-2 mb-3;
}

.field label {
   @apply text-gray-600;
}

.input-field {
   @apply font-medium;
}

.list {
   @apply list-disc ml-6 mb-4 space-y-2;
}

.list li {
   @apply pl-2;
}

.signatures-and-witnesses {
   @apply mt-16 space-y-12;
}

.signatures {
   @apply grid grid-cols-2 gap-12;
}

.signature-block {
   @apply flex flex-col items-center;
}

.signature-line {
   @apply w-48 border-b border-black mb-2;
}

.signature-label {
   @apply text-sm text-gray-600;
}

.signature-date {
   @apply mt-4 text-sm;
}

.witnesses {
   @apply grid grid-cols-2 gap-12 mt-12;
}

.witness-block {
   @apply space-y-4;
}

.witness-block h3 {
   @apply font-semibold mb-4;
}

.witness-field {
   @apply flex flex-col gap-2;
}

.witness-field label {
   @apply text-sm text-gray-600;
}

.witness-field .signature-line {
   @apply w-48 border-b border-black mb-2;
}

@media print {
   .rent-agreement-container {
      @apply p-0;
   }

   .list {
      @apply break-inside-avoid;
   }

   h2 {
      @apply break-before-auto break-after-avoid;
   }

   .signatures-and-witnesses {
      @apply break-inside-avoid;
   }
}
</style>
