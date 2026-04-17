export default function register(bot) {
  bot.command("help", async (ctx) => {
    await ctx.reply(
      "Commands: /start, /help\n\nHow it works: the bot watches channel posts and edited channel posts, scans post text and captions for the first supported contract address, fetches token market data, and replies to that channel post.\n\nChannel setup: add the bot to the channel as an admin and allow it to post messages.\n\nDetection: EVM-style addresses are supported first. If no valid contract is found, the bot does nothing. If token data is unavailable, it may reply with a short failure note or stay silent for noisy unsupported inputs.\n\nIf chart media fails, the bot falls back to a text-only token summary with useful links."
    );
  });
}
