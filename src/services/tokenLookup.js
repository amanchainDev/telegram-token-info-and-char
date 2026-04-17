import { cfg } from "../lib/config.js";
import { getJson } from "../lib/http.js";
import { logInfo } from "../utils/logger.js";

export async function fetchTokenDetails(contract) {
  const url = `${cfg.TOKEN_API_BASE_URL.replace(/\/+$/, "")}/latest/dex/tokens/${encodeURIComponent(contract)}`;
  logInfo("[token] lookup start", { contract });

  const json = await getJson(url);
  const pair = Array.isArray(json?.pairs) ? json.pairs[0] : null;

  if (!pair) {
    throw new Error("No token market data found");
  }

  const chainId = pair.chainId || "evm";
  const address = pair.baseToken?.address || contract;

  return {
    name: pair.baseToken?.name || "Unknown token",
    symbol: pair.baseToken?.symbol || "UNKNOWN",
    chain: chainId,
    address,
    priceUsd: pair.priceUsd,
    marketCap: pair.marketCap || pair.fdv,
    liquidityUsd: pair.liquidity?.usd,
    change24h: pair.priceChange?.h24,
    volume24h: pair.volume?.h24,
    explorerUrl: buildExplorerUrl(chainId, address),
    chartUrl: pair.url || "",
    pairAddress: pair.pairAddress || "",
    pricePointsHint: pair.priceChange || {},
    rawPair: pair
  };
}

function buildExplorerUrl(chainId, address) {
  const map = {
    ethereum: `https://etherscan.io/token/${address}`,
    bsc: `https://bscscan.com/token/${address}`,
    base: `https://basescan.org/token/${address}`,
    arbitrum: `https://arbiscan.io/token/${address}`,
    polygon: `https://polygonscan.com/token/${address}`,
    avalanche: `https://snowtrace.io/token/${address}`
  };

  return map[chainId] || `https://etherscan.io/token/${address}`;
}
