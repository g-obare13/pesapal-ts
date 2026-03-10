<script lang="ts">
  import CheckoutForm from '$lib/components/CheckoutForm.svelte';
  
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

  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;
  const orderDescription = `Order for ${products.map((p) => p.name).join(", ")}`;
</script>

<div class="min-h-screen p-4 md:p-8 lg:p-12">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

      <!-- Summary Order Column -->
      <div class="space-y-8 p-4 md:p-8">
        <div class="flex flex-col gap-2">
          <h2>Summary Order</h2>
          <p class="text-slate-500">
            Check your item and select your shipping for better experience order item.
          </p>
        </div>

        <div class="border shadow-sm overflow-hidden rounded-xl bg-white">
          <div class="divide-y divide-slate-100">
            {#each products as product}
              <div class="flex gap-4 p-4 items-center">
                <div class="shrink-0 rounded-xl overflow-hidden bg-slate-100" style="width: 6rem; height: 6rem;">
                  <img
                    src={product.image}
                    alt={product.name}
                    style="width: 100%; height: 100%; object-fit: cover;"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <h6>{product.name}</h6>
                  <p class="text-sm text-slate-500">{product.description}</p>
                  <span class="font-medium text-lg" style="color: #c6a75e;">
                    KES {product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Payment Details Column -->
      <div class="space-y-8 bg-neutral-50 border p-4 md:p-8 rounded-3xl">
        <p class="text-slate-600">
          Complete your purchase by providing your payment details.
        </p>
        <CheckoutForm amount={total} description={orderDescription} />
      </div>

    </div>
  </div>
</div>