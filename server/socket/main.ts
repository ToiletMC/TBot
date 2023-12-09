import { createBot } from "mineflayer";
import { defineIOHandler } from "nuxt3-socket.io/helpers";

export default defineIOHandler((io) => {
  io.on("connect", (socket) => {
    let bots: import("mineflayer").Bot[] = [];

    socket.on("ping", () => socket.emit("pong"));
    socket.on(
      "run bot",
      (options: {
        user: string;
        password: string;
        running: boolean;
        logs: string[];
      }) => {
        console.log("run bot", options);
        const bot = createBot({
          host: "43.248.188.214",
          port: 29239,
          username: options.user,
        });
        bots.push(bot);
        bot.once("spawn", () => {
          bot.chat(`/login ${options.password}`);
        });
        bot.on("message", (jsonMsg) => {
          socket.emit("receive chat", options, jsonMsg.toHTML());
        });
        bot.on("kicked", (reason) => {
          socket.emit("end", options, reason);
        });
      }
    );
    socket.on(
      "stop bot",
      (options: {
        user: string;
        password: string;
        running: boolean;
        logs: string[];
      }) => {
        bots.find((bot) => bot.username === options.user)?.quit();
        bots = bots.filter((bot) => bot.username !== options.user);
      }
    );
    socket.on(
      "chat",
      (
        options: {
          user: string;
          password: string;
          running: boolean;
          logs: string[];
        },
        msg: string
      ) => {
        bots.find((bot) => bot.username === options.user)?.chat(msg);
      }
    );
  });
});
