<script setup lang="ts">
import { ref } from "vue";
import { Info } from "lucide-vue-next";

const props = defineProps<{
  amount: number;
  description: string;
}>();

const loading = ref(false);
const error = ref<string | null>(null);
const redirectUrl = ref<string | null>(null);

const formData = ref({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  country: "KE",
  state: "KE04",
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await $fetch("/api/checkout", {
      method: "POST",
      body: {
        ...formData.value,
        amount: props.amount.toFixed(2),
        description: props.description,
      },
    });

    redirectUrl.value = (data as any).redirect_url;
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message;
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="redirectUrl" class="space-y-4 animate-fadeIn">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Payment Gateway</h3>
      <button
        @click="
          redirectUrl = null;
          loading = false;
        "
        class="text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        Cancel and return
      </button>
    </div>
    <div
      class="relative w-full min-h-[600px] rounded-3xl overflow-hidden border bg-white shadow-xl animate-zoomIn"
    >
      <iframe
        :src="redirectUrl"
        class="absolute inset-0 w-full h-full border-0"
        title="Pesapal Payment"
        allow="payment"
      />
    </div>
    <div
      class="flex items-center gap-2 text-xs text-slate-400 justify-center p-2"
    >
      <Info class="h-3 w-3" />
      <span>Secured by Pesapal</span>
    </div>
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="firstName" class="font-semibold text-sm">
          First name <span class="text-[#c6a75e]">*</span>
        </label>
        <input
          v-model="formData.firstName"
          id="firstName"
          placeholder="First Name"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c6a75e] outline-none"
          required
        />
      </div>
      <div class="space-y-2">
        <label for="lastName" class="font-semibold text-sm">
          Last name <span class="text-[#c6a75e]">*</span>
        </label>
        <input
          v-model="formData.lastName"
          id="lastName"
          placeholder="Last Name"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c6a75e] outline-none"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="phone" class="font-semibold text-sm">
          Phone <span class="text-[#c6a75e]">*</span>
        </label>
        <input
          v-model="formData.phone"
          id="phone"
          placeholder="e.g. 0712345678"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c6a75e] outline-none"
          required
        />
      </div>
      <div class="space-y-2">
        <label for="email" class="font-semibold text-sm">
          Email address <span class="text-[#c6a75e]">*</span>
        </label>
        <input
          v-model="formData.email"
          id="email"
          type="email"
          placeholder="name@email.com"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c6a75e] outline-none"
          required
        />
      </div>

      <div class="md:col-span-2 space-y-2">
        <label for="address" class="font-semibold text-sm">
          Street address <span class="text-[#c6a75e]">*</span>
        </label>
        <input
          v-model="formData.address"
          id="address"
          placeholder="House number and street name"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c6a75e] outline-none"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="city" class="font-semibold text-sm">
          Town / City <span class="text-[#c6a75e]">*</span>
        </label>
        <input
          v-model="formData.city"
          id="city"
          placeholder="City"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c6a75e] outline-none"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="state" class="font-semibold text-sm">
          State / County <span class="text-[#c6a75e]">*</span>
        </label>
        <select
          v-model="formData.state"
          id="state"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c6a75e] outline-none bg-white"
        >
          <option value="KE04">KE04</option>
          <option value="KE01">Mombasa</option>
          <option value="KE47">Nairobi</option>
          <option value="KE21">Kisumu</option>
        </select>
      </div>
    </div>

    <div class="pt-4 border-t border-slate-100 space-y-3">
      <div class="flex justify-between text-slate-500 text-sm">
        <span>Subtotal</span>
        <span class="font-semibold text-slate-900 font-mono">
          KES
          {{
            (amount / 1.16).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </div>
      <div class="flex justify-between text-slate-500 text-sm">
        <span>VAT (16%)</span>
        <span class="font-semibold text-slate-900 font-mono">
          KES
          {{
            (amount - amount / 1.16).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </div>
      <div
        class="flex justify-between text-lg font-bold pt-2 border-t border-dashed border-slate-200"
      >
        <span>Total</span>
        <span class="font-mono" style="color: #c6a75e"
          >KES {{ amount.toLocaleString() }}</span
        >
      </div>
    </div>

    <div
      v-if="error"
      class="p-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg"
    >
      {{ error }}
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full py-4 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      style="background-color: #c6a75e"
      @mouseover="
        ($event.target as HTMLElement).style.backgroundColor = '#8a7441'
      "
      @mouseleave="
        ($event.target as HTMLElement).style.backgroundColor = '#c6a75e'
      "
    >
      <div
        v-if="loading"
        class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
      />
      {{ loading ? "Processing..." : "Complete Purchase" }}
    </button>
  </form>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
.animate-zoomIn {
  animation: zoomIn 0.5s ease-out;
}
</style>
