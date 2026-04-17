export const BOT_PROFILE = [
  "Purpose: Watch Telegram channel posts for token contract addresses and reply with a token summary and chart preview when available.",
  "Public commands: /start explains what the bot does. /help explains channel setup, permissions, and detection behavior.",
  "Features: scans channel posts and edited channel posts, supports EVM-style contract detection, processes only the first valid contract in a post, fetches market data, tries to attach a chart image, and falls back to text-only replies when media fails.",
  "Rules: Telegram-only bot. Channel monitoring is automatic only for channel posts. Private chats are for discovery via /start and /help. No reply is sent when no valid contract is detected."
].join(" ");
