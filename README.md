# TBot

## 手动构建

1. 下载 nodejs v18或v20 https://nodejs.cn/download
2. 下载项目源码
3. 在项目目录下运行下面的命令，如果报错可以挂梯子

```bash
npm config set registry https://registry.npmmirror.com
npm i -g pnpm
npx pnpm i
npx pnpm build
```

然后release文件夹里面就是打包好的文件了
