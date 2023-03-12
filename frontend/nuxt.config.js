export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: "static",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Ga-chain - Playground",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/logo ga-chain.png" }],
    script: [
      {
        src: "https://accounts.google.com/gsi/client",
        async: true,
      },
      {
        src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js",
      },
      {
        src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/dotenv"],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios"],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
    extend(config, ctx) {
      config.node = {
        fs: "empty",
        child_process: "empty",
        net: "empty",
        tls: "empty",
      };
    },
  },
  publicRuntimeConfig: {
    gClientID: process.env.G_CLIENT_ID,
    gSecredId: process.env.G_CLIENT_SECRET,
    base_url: "https://querybq-buzpivkitq-uc.a.run.app/",
  },
};
