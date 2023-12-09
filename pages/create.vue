<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <v-form @submit.prevent="submit">
        <v-text-field
          label="Minecraft 用户名"
          v-model="data.user"
          :rules="[Boolean]"
        />
        <v-text-field
          label="服务器登录密码"
          v-model="data.password"
          :rules="[Boolean]"
          type="password"
        />
        <v-btn type="submit" block>创建</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script lang="ts" setup>
const data = ref<Bot>({
  user: "",
  password: "",
  running: false,
  logs: [],
});

function submit() {
  if (!(data.value.user && data.value.password)) return;
  localStorage.setItem(
    "bots",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("bots") ?? "[]"),
      data.value,
    ])
  );
}
</script>
