export const cfg = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  MONGODB_URI: process.env.MONGODB_URI || "",
  TOKEN_API_BASE_URL: process.env.TOKEN_API_BASE_URL || "https://api.dexscreener.com",
  CHART_IMAGE_BASE_URL: process.env.CHART_IMAGE_BASE_URL || "https://quickchart.io/chart",
  REQUEST_TIMEOUT_MS: Number(process.env.REQUEST_TIMEOUT_MS || 15000)
};
