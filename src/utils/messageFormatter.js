import { BOT_PROFILE } from "../lib/botProfile.js";
import { formatPercent, formatUsd, shortenAddress } from "./format.js";

export function formatTokenSummary(token) {
  const lines = [
    `${token.name || "Unknown token"} (${token.symbol || "UNKNOWN"})`,
    `Chain: ${token.chain || "unknown"}`,
    `Contract: ${shortenAddress(token.address)}`,
    `Price: ${formatUsd(token.priceUsd)}`,
    `Market cap: ${formatUsd(token.marketCap)}`,
    `Liquidity: ${formatUsd(token.liquidityUsd)}`,
    `24h change: ${formatPercent(token.change24h)}`
  ];

  if (token.volume24h !== undefined && token.volume24h !== null) {
    lines.push(`24h volume: ${formatUsd(token.volume24h)}`);
  }

  if (token.explorerUrl) {
    lines.push(`Explorer: ${token.explorerUrl}`);
  }

  if (token.chartUrl) {
    lines.push(`Chart: ${token.chartUrl}`);
  }

  lines.push("Data may be delayed or unavailable.");
  return lines.join("\n");
}

export function getBotProfile() {
  return BOT_PROFILE;
}
