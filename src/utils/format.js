export function shortenAddress(address = "") {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatUsd(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "n/a";
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  if (num >= 1) return `$${num.toFixed(4)}`;
  if (num > 0) return `$${num.toPrecision(4)}`;
  return "$0";
}

export function formatPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "n/a";
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
}
