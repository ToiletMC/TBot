<template>
  <div class="flex flex-1 flex-col">
    <label class="input input-bordered flex items-center gap-2">
      <i-mdi-account />
      <input
        type="text"
        class="grow"
        placeholder="MC 用户名"
        v-model="account.userName"
      />
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <i-mdi-key />
      <input
        type="password"
        class="grow"
        placeholder="服务器登录密码"
        v-model="account.serverPassword"
      />
    </label>
    <button v-if="state.running" class="btn btn-success" @click="stop">
      <i-mdi-play />
      停止机器人
    </button>
    <button v-else class="btn btn-error" @click="start">
      <i-mdi-pause />
      启动机器人
    </button>
    <div
      className="mockup-window border border-base-300 flex-1 overflow-y-auto scroll-smooth"
      ref="chatBox"
    >
      <div
        v-for="chat in state.chats"
        class="chat"
        :class="{ 'chat-end': chat[0], 'chat-start': !chat[0] }"
      >
        <div class="chat-bubble" v-html="chat[1]"></div>
      </div>
    </div>
    <form @submit.prevent="send">
      <label class="input input-bordered flex items-center gap-2">
        <i-mdi-message />
        <input
          type="text"
          class="grow"
          placeholder="发送消息或命令"
          v-model="sendText"
        />
      </label>
    </form>
  </div>
</template>

<script lang="ts" setup>
const account = reactive({
  userName: '',
  serverPassword: '',
})
const state = reactive({
  running: false,
  chats: [] as [boolean, string][],
})
const sendText = ref('')
const chatBox = ref<HTMLDivElement | null>(null)

window.ipcRenderer.on('收到聊天消息', (_, msg: string, plain: string) => {
  state.chats.push([plain.includes(`${account.userName}：`), msg])
  scroll()
})
window.ipcRenderer.on('停止', (_, reason: string) => {
  state.chats.push([true, `断开连接\n${reason}`])
  stop()
  scroll()
})
window.ipcRenderer.on('状态', (_, running: boolean) => {
  state.running = running
})

window.ipcRenderer.send('获取状态')

function start() {
  state.running = true
  if (account.userName === '' || account.serverPassword === '') {
    alert('用户名或密码为空')
    return
  }
  state.chats = []
  // 需要将reactive转换为object
  window.ipcRenderer.send('启动机器人', { ...account })
}

function stop() {
  state.running = false
  window.ipcRenderer.send('停止机器人')
}

function send() {
  if (sendText.value === '') return
  if (sendText.value.includes('/')) state.chats.push([true, sendText.value])
  window.ipcRenderer.send('发送聊天消息', sendText.value)
  sendText.value = ''
  scroll()
}

function scroll() {
  requestAnimationFrame(() => {
    chatBox.value!.scrollTop = chatBox.value!.scrollHeight
  })
}
</script>
