const EVM_REGEX = /(^|[^A-Za-z0-9])(0x[a-fA-F0-9]{40})(?![A-Za-z0-9])/g;

export function detectFirstContract(text = "") {
  if (!text) return null;

  let match;
  while ((match = EVM_REGEX.exec(text)) !== null) {
    const address = match[2];
    const before = text.slice(Math.max(0, match.index - 12), match.index + match[1].length);
    const after = text.slice(match.index + match[0].length, match.index + match[0].length + 12);
    const context = `${before}${address}${after}`.toLowerCase();

    if (context.includes("http") || context.includes("www.")) {
      continue;
    }

    return {
      chain: "evm",
      address
    };
  }

  return null;
}
