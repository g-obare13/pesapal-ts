<script setup lang="ts">
import { ref, computed } from "vue";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro - Titanium Blue",
    description: "256GB - 6.1 inch Display",
    price: 10,
    image: "/phones.jpg",
    quantity: 1,
  },
  {
    id: 2,
    name: "Nike Air Max 270 - White/Volt",
    description: "Size: 42 EU - 8.5 US",
    price: 10,
    image: "/sneakers.jpg",
    quantity: 1,
  },
];

const shippingMethod = ref("fedex");

const subtotal = computed(() =>
  products.reduce((acc, p) => acc + p.price * p.quantity, 0),
);
const vat = computed(() => subtotal.value * 0.16);
const shipping = computed(() => (shippingMethod.value === "fedex" ? 0 : 1200));
const total = computed(() => subtotal.value + vat.value + shipping.value);

const orderDescription = computed(
  () => `Order for ${products.map((p) => p.name).join(", ")}`,
);
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 lg:p-12">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Summary Order Column -->
        <div class="space-y-8 p-4 md:p-8">
          <div class="flex flex-col gap-2">
            <h2 class="text-2xl font-bold">Summary Order</h2>
            <p>
              Check your item and select your shipping for better experience
              order item.
            </p>
          </div>

          <div class="border shadow-sm overflow-hidden rounded-xl bg-white">
            <div class="divide-y divide-slate-100">
              <div
                v-for="product in products"
                :key="product.id"
                class="flex gap-4 p-4 items-center"
              >
                <div
                  class="h-24 w-24 relative rounded-xl overflow-hidden bg-slate-100 shrink-0"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="object-cover w-full h-full"
                  />
                </div>
                <div class="flex-1 flex flex-col gap-1">
                  <h6 class="font-semibold">{{ product.name }}</h6>
                  <p class="text-sm text-slate-500">
                    {{ product.description }}
                  </p>
                  <span class="font-medium text-lg text-[#c6a75e]">
                    KES {{ product.price.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Details Column -->
        <div class="space-y-8 bg-neutral-50 border p-4 md:p-8 rounded-3xl">
          <div>
            <p class="text-slate-600">
              Complete your purchase by providing your payment details.
            </p>
          </div>

          <CheckoutForm :amount="total" :description="orderDescription" />
        </div>
      </div>
    </div>
  </div>
</template>
