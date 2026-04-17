# Token Watch Bot

A Telegram bot built with grammY that watches channel posts for token contract addresses and replies with token info plus a chart preview when available.

## Features

- Watches Telegram channel posts and edited channel posts
- Detects the first supported contract address in post text or caption
- Fetches token market data from an external provider
- Builds a chart preview image
- Replies directly to the original channel post
- Falls back to text-only replies if chart media fails
- Includes /start and /help for private chat discoverability

## Architecture

- `src/index.js`: boot, config checks, polling runner, retry logic
- `src/bot.js`: bot creation and feature wiring
- `src/commands/*`: public commands
- `src/features/channelPosts.js`: channel post and edited post processing
- `src/services/*`: token lookup and chart services
- `src/utils/*`: logging, memory logs, formatting, contract detection
- `src/lib/*`: config and HTTP helpers

## Setup

1. Create a bot with BotFather.
2. Copy `.env.sample` to `.env`.
3. Set `TELEGRAM_BOT_TOKEN`.
4. Install dependencies:

bash
npm install


5. Start locally:

bash
npm run dev


Or run normally:

bash
npm start


## Environment

- `TELEGRAM_BOT_TOKEN`: required Telegram bot token
- `TOKEN_API_BASE_URL`: optional token data base URL, defaults to DexScreener API base
- `CHART_IMAGE_BASE_URL`: optional chart renderer base URL, defaults to QuickChart
- `REQUEST_TIMEOUT_MS`: optional request timeout, default `15000`

## Commands

- `/start` → intro and purpose
- `/help` → explains setup, permissions, detection, and fallback behavior

## Channel usage

1. Add the bot to your Telegram channel as an admin.
2. Allow it to post messages.
3. Post a token contract address like an EVM `0x...` address.
4. The bot scans the post and replies to it with a summary.

## Integrations

- Token data: `GET {TOKEN_API_BASE_URL}/latest/dex/tokens/:contract`
- Chart image: `GET {CHART_IMAGE_BASE_URL}?c=<chart-config>`

The bot uses request timeouts and short error handling. If chart generation or media sending fails, it falls back to text.

## Deployment

This bot is ready for a single Render web service or worker-style service running one Node.js process.

Required env vars:
- `TELEGRAM_BOT_TOKEN`

Recommended:
- `TOKEN_API_BASE_URL`
- `CHART_IMAGE_BASE_URL`
- `REQUEST_TIMEOUT_MS`

## Troubleshooting

- If startup exits immediately, check that `TELEGRAM_BOT_TOKEN` is set.
- If the bot does not answer in a channel, make sure it is an admin and can post messages.
- If token data is missing, the upstream token provider may not know the contract yet.
- Check logs for `[channel]`, `[token]`, `[chart]`, `[send]`, and `[polling]` events.

## Extending

To add more chains, extend `src/utils/contracts.js` and keep the same handler flow in `src/features/channelPosts.js`.
