export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      "Hanken Grotesk": [300, 400, 500, 600, 700],
    },
    display: "swap",
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    pesapalConsumerKey: process.env.PESAPAL_CONSUMER_KEY,
    pesapalConsumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
    pesapalEnvironment: process.env.PESAPAL_ENVIRONMENT || "sandbox",
    public: {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
  },
});
