import { Bot } from "grammy";
import { registerChannelHandlers } from "./features/channelPosts.js";

export function createBot(token) {
  const bot = new Bot(token);
  registerChannelHandlers(bot);
  return bot;
}
