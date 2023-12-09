<template>
  <v-container>
    <v-btn @click="socket.emit('ping')">ping</v-btn>
  </v-container>
</template>

<script lang="ts" setup>
const socket = useSocket();

onMounted(() => {
  socket.on("pong", () => alert("pong"));
});
</script>
