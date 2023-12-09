<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon icon="mdi-menu" @click.stop="drawer = !drawer" />
      <v-app-bar-title>TBot</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-list-item link to="/" title="首页" prepend-icon="mdi-home" />
      <v-list-item
        link
        to="/create"
        title="创建机器人"
        prepend-icon="mdi-plus"
      />
      <v-divider />
      <v-list-item
        v-for="bot in bots"
        link
        :to="`/bot/${bot.user}`"
        :title="bot.user"
        prepend-icon="mdi-robot"
      />
    </v-navigation-drawer>
    <v-main>
      <nuxt-page />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const drawer = ref(true);
const bots = ref<Bot[]>([]);

function refresh() {
  bots.value = JSON.parse(localStorage.getItem("bots") || "[]");
}

onMounted(() => {
  setInterval(refresh, 500);
});
</script>
