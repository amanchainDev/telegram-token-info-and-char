This Telegram bot watches channel posts for token contract addresses and replies with a token summary plus a chart preview when available.

Public commands:
1) /start
What it does: Introduces the bot and explains the main channel-monitoring behavior.
Arguments: none.

2) /help
What it does: Explains setup, permissions, supported contract detection, and fallback behavior.
Arguments: none.

Setup:
1) Create a Telegram bot with BotFather.
2) Set TELEGRAM_BOT_TOKEN in your environment.
3) Install dependencies with npm install.
4) Run locally with npm run dev or start with npm start.
5) Add the bot to your target channel as an admin.
6) Give it permission to read posts and send messages.

Channel behavior:
1) The bot watches channel posts and edited channel posts.
2) It scans post text and captions for the first valid supported contract address.
3) EVM-style addresses are supported by default.
4) If no valid contract is found, the bot does nothing.
5) If token data is found, the bot replies directly to the original channel post.
6) If chart media sending fails, the bot falls back to a text-only summary.
7) If token lookup fails, the bot may send a short failure reply only when the input looked like a real contract mention. Otherwise it stays silent.

Token response fields:
1) Token name
2) Symbol
3) Chain or network
4) Shortened contract address
5) Current price
6) Market cap when available
7) Liquidity when available
8) 24h change
9) 24h volume when available
10) Explorer link
11) Chart or trading link
12) Short disclaimer that data may be delayed or unavailable

Environment variables:
1) TELEGRAM_BOT_TOKEN
Required. Telegram bot token.

2) TOKEN_API_BASE_URL
Optional. Base URL for token market data lookups. Defaults to https://api.dexscreener.com.

3) CHART_IMAGE_BASE_URL
Optional. Base URL for chart image rendering. Defaults to https://quickchart.io/chart.

4) REQUEST_TIMEOUT_MS
Optional. HTTP timeout in milliseconds. Defaults to 15000.

Deployment notes:
1) The bot uses long polling with @grammyjs/runner.
2) On startup it clears any webhook and then starts polling.
3) If Telegram returns a polling conflict during deploy overlap, the bot backs off and retries automatically.
4) This project is Telegram-only.

Known limitations:
1) Only the first valid contract in a post is processed.
2) Detection starts with common EVM-style addresses.
3) Token quality depends on the upstream market data provider.
4) Chart preview is a lightweight generated preview and may not match every trading platform exactly.
