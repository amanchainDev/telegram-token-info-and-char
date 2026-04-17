export default function register(bot) {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Hi. I watch channel posts for token contract addresses and reply with a token summary plus a chart preview when available. Add me to a channel as an admin with permission to read and post replies, then post a supported contract address in the channel."
    );
  });
}
