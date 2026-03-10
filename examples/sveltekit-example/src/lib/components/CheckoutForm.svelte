<script lang="ts">
  import { Info, ChevronLeft } from 'lucide-svelte';

  let { amount, description } = $props<{
    amount: number;
    description: string;
  }>();

  let loading = $state(false);
  let error = $state<string | null>(null);
  let redirectUrl = $state<string | null>(null);

  let formData = $state({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'KE',
    state: 'KE04',
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = null;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: amount.toFixed(2),
          description: description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      redirectUrl = data.redirect_url;
    } catch (err: any) {
      error = err.message;
      loading = false;
    }
  }
</script>

{#if redirectUrl}
  <div class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Payment Gateway</h3>
      <button
        onclick={() => {
          redirectUrl = null;
          loading = false;
        }}
        class="text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        Cancel and return
      </button>
    </div>
    <div
      class="relative w-full min-h-[600px] rounded-3xl overflow-hidden border bg-white shadow-xl"
    >
      <iframe
        src={redirectUrl}
        class="absolute inset-0 w-full h-full border-0"
        title="Pesapal Payment"
        allow="payment"
      ></iframe>
    </div>
    <div class="flex items-center gap-2 text-xs text-slate-400 justify-center p-2">
      <Info class="h-3 w-3" />
      <span>Secured by Pesapal</span>
    </div>
  </div>
{:else}
  <form onsubmit={handleSubmit} class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="firstName" class="font-semibold text-sm">
          First name <span class="text-[#c6a75e]">*</span>
        </label>
        <input
          bind:value={formData.firstName}
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
          bind:value={formData.lastName}
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
          bind:value={formData.phone}
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
          bind:value={formData.email}
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
          bind:value={formData.address}
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
          bind:value={formData.city}
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
          bind:value={formData.state}
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
          KES { (amount / 1.16).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
        </span>
      </div>
      <div class="flex justify-between text-slate-500 text-sm">
        <span>VAT (16%)</span>
        <span class="font-semibold text-slate-900 font-mono">
          KES { (amount - amount / 1.16).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
        </span>
      </div>
      <div class="flex justify-between text-lg font-bold pt-2 border-t border-dashed border-slate-200">
        <span>Total</span>
        <span class="font-mono" style="color: #c6a75e">KES { amount.toLocaleString() }</span>
      </div>
    </div>

    {#if error}
      <div class="p-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg">
        {error}
      </div>
    {/if}

    <button
      type="submit"
      disabled={loading}
      class="w-full py-4 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      style="background-color: #c6a75e"
      onmouseenter={(e) => (e.currentTarget.style.backgroundColor = '#8a7441')}
      onmouseleave={(e) => (e.currentTarget.style.backgroundColor = '#c6a75e')}
    >
      {#if loading}
        <div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      {/if}
      { loading ? 'Processing...' : 'Complete Purchase' }
    </button>
  </form>
{/if}
