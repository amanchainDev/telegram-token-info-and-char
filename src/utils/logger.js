export function safeErr(err) {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err);
}

export function logInfo(msg, meta = {}) {
  console.log(msg, meta);
}

export function logWarn(msg, meta = {}) {
  console.warn(msg, meta);
}

export function logError(msg, meta = {}) {
  console.error(msg, meta);
}
