import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { Bot, createBot } from 'mineflayer'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
let bot: Bot | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  ipcMain.on('启动机器人', (_, { userName, serverPassword }) => {
    bot = createBot({
      username: userName,
      host: 'mc.toiletmc.net',
      port: 29239,
    })
    bot.on('spawn', () => {
      bot?.chat(`/login ${serverPassword}`)
    })
    bot.on('message', (jsonMsg) => {
      // console.log(jsonMsg.toAnsi())
      win?.webContents.send(
        '收到聊天消息',
        jsonMsg.toHTML(),
        jsonMsg.toString(),
      )
    })
    bot.on('end', (reason) => {
      win?.webContents.send('停止', reason)
    })
    bot.on('kicked', (reason) => {
      win?.webContents.send('停止', reason)
    })
    bot.on('error', (err) => {
      win?.webContents.send('停止', err.message)
    })
  })
  ipcMain.on('发送聊天消息', (_, msg) => {
    bot?.chat(msg)
  })
  ipcMain.on('停止机器人', (_) => {
    bot?.quit()
    bot = null
  })
  ipcMain.on('获取状态', (_) => {
    win?.webContents.send('状态', bot !== null)
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
