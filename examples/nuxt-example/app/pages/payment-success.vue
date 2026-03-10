<script setup lang="ts">
import { ref, onMounted } from "vue";
import { CheckCircle2, ChevronLeft } from "lucide-vue-next";

const route = useRoute();
const orderTrackingId = route.query.OrderTrackingId;
const orderMerchantReference = route.query.OrderMerchantReference;

const isIframe = ref(false);

onMounted(() => {
  isIframe.value = window.self !== window.top;
});

const handleBackToStore = () => {
  if (isIframe.value) {
    window.parent.location.href = "/";
  }
};
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center p-4',
      isIframe ? '' : 'min-h-screen bg-slate-50 relative z-50',
    ]"
  >
    <div
      :class="[
        'max-w-md w-full border rounded-3xl bg-white p-8',
        isIframe ? 'border-0 shadow-none' : 'shadow-lg',
      ]"
    >
      <div class="text-center space-y-4">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <CheckCircle2 class="h-10 w-10" />
        </div>

        <div>
          <h1 class="text-2xl font-bold">Payment Initiated!</h1>
          <p class="text-slate-500">
            Your payment for order
            <span class="font-mono text-[#c6a75e] font-semibold">{{
              orderMerchantReference
            }}</span>
            is being processed.
          </p>
        </div>

        <div class="space-y-3 py-6 border-y border-slate-100">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Tracking ID:</span>
            <span class="font-medium font-mono text-xs">{{
              orderTrackingId
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Status:</span>
            <span class="text-emerald-500 font-semibold uppercase"
              >Pending/Completed</span
            >
          </div>
        </div>

        <button
          v-if="isIframe"
          @click="handleBackToStore"
          class="w-full py-4 bg-[#c6a75e] text-white rounded-2xl font-bold hover:bg-[#c6a75e]/80 transition-all flex items-center justify-center"
        >
          <ChevronLeft class="mr-2 h-4 w-4" />
          Back to Store
        </button>
        <NuxtLink
          v-else
          to="/"
          class="w-full py-4 bg-[#c6a75e] text-white rounded-2xl font-bold hover:bg-[#c6a75e]/80 transition-all flex items-center justify-center"
        >
          <ChevronLeft class="mr-2 h-4 w-4" />
          Back to Store
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
