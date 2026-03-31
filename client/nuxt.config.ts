// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseURL: import.meta.env.API_URL,
    }
  },
  css: ['v-calendar/style.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  // imports: {
  //   autoImport: false,
  // },
  components: {
    dirs: []
  }
})