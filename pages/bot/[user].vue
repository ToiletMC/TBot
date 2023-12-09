<template>
  <v-container>
    <v-row>
      <v-col>
        <v-chip
          @click="
            socket.emit('stop bot', bot);
            bot!.running = false;
          "
          color="green"
          prepend-icon="mdi-play"
          v-if="bot?.running"
        >
          运行中
        </v-chip>
        <v-chip
          @click="
            socket.emit('run bot', bot);
            bot!.running = true;
          "
          color="red"
          prepend-icon="mdi-pause"
          v-else
        >
          已停止
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list :height="500" density="compact" rounded>
          <v-list-item v-for="log in logs" :title="log" />
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="11">
        <v-text-field label="发送消息或命令" />
      </v-col>
      <v-col>
        <v-btn icon="mdi-send" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const route = useRoute();
const bot = ref<Bot | null>(null);
const logs = ref<string[]>([]);
const socket = useSocket();

onMounted(() => {
  bot.value = JSON.parse(localStorage.getItem("bots") || "[]").find(
    (bot: Bot) => bot.user === route.params.user
  );
  socket.on(
    "receive chat",
    (target: Bot, jsonMsg: import("prismarine-chat").ChatMessage) => {
      if (target.user !== route.params.user) return;
      logs.value.push(jsonMsg.toHTML());
      console.log(jsonMsg.toAnsi());
    }
  );
  socket.on("end", (target: Bot, reason: string) => {
    if (target.user !== route.params.user) return;
    logs.value.push(`disconnect: ${reason}`);
  });
});
</script>
