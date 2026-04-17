import { cfg } from "../lib/config.js";
import { getBuffer } from "../lib/http.js";
import { logInfo } from "../utils/logger.js";

export async function fetchChartImage(token) {
  logInfo("[chart] fetch start", {
    contract: token.address,
    chartUrl: Boolean(token.chartUrl)
  });

  const points = buildPoints(token);
  const chartConfig = {
    type: "line",
    data: {
      labels: ["6h", "12h", "24h", "Now"],
      datasets: [
        {
          label: `${token.symbol} trend`,
          data: points,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79,70,229,0.18)",
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: `${token.name} (${token.symbol})`
        }
      },
      scales: {
        y: {
          ticks: { color: "#444" }
        },
        x: {
          ticks: { color: "#444" }
        }
      }
    }
  };

  const url = `${cfg.CHART_IMAGE_BASE_URL.replace(/\/+$/, "")}?width=900&height=500&format=png&c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
  return await getBuffer(url);
}

function buildPoints(token) {
  const base = Number(token.priceUsd || 0);
  const delta = Number(token.change24h || 0) / 100;
  if (!Number.isFinite(base) || base <= 0) {
    return [1, 1.02, 0.98, 1.01];
  }

  const start = base / (1 + delta || 1);
  const mid1 = start * 1.03;
  const mid2 = base * 0.97;
  return [round(start), round(mid1), round(mid2), round(base)];
}

function round(n) {
  if (!Number.isFinite(n)) return 0;
  return Number(n.toFixed(8));
}
