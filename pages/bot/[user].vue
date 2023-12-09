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
          <v-list-item v-for="log in logs" v-html="log" />
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="11">
        <v-text-field label="发送消息或命令" v-model="msg" auto-grow />
      </v-col>
      <v-col>
        <v-btn icon="mdi-send" @click="socket.emit('chat', bot, msg)" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-chip color="green" @click="socket.emit('chat', bot, '/tpaccept')">
          同意传送请求
        </v-chip>
        <v-chip color="primary" @click="socket.emit('chat', bot, '/list')">
          玩家列表
        </v-chip>
        <v-chip color="red" @click="socket.emit('chat', bot, '/logout')">
          断开连接
        </v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const route = useRoute();
const bot = ref<Bot | null>(null);
const logs = ref<string[]>([]);
const socket = useSocket();
const msg = ref("");

onMounted(() => {
  bot.value = JSON.parse(localStorage.getItem("bots") || "[]").find(
    (bot: Bot) => bot.user === route.params.user
  );
  socket.on("receive chat", (target: Bot, html: string) => {
    if (target.user !== route.params.user) return;
    logs.value.push(html);
    document.querySelector(".v-list")!.scrollTop =
      document.querySelector(".v-list")!.scrollHeight;
  });
  socket.on("end", (target: Bot, reason: string) => {
    if (target.user !== route.params.user) return;
    logs.value.push(`断开连接: ${reason}`);
    bot.value!.running = false;
    document.querySelector(".v-list")!.scrollTop =
      document.querySelector(".v-list")!.scrollHeight;
  });
});
</script>
