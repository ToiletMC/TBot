import colors from "vuetify/util/colors";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@invictus.codes/nuxt-vuetify", "nuxt3-socket.io"],
  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: colors.blue.darken1,
              secondary: colors.deepPurple.darken1,
            },
          },
        },
        defaultTheme: "dark",
      },
    },
    moduleOptions: {},
  },
  socket: {
    serverOptions: {},
  },
});
