import "dotenv/config";
import { run } from "@grammyjs/runner";

function safeErr(err) {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err);
}

process.on("unhandledRejection", (err) => {
  console.error("[process] unhandledRejection", { error: safeErr(err) });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[process] uncaughtException", { error: safeErr(err) });
  process.exit(1);
});

let runnerHandle = null;
let restarting = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function boot() {
  try {
    const [{ cfg }, { createBot }, { registerCommands }, { safeErr: helperSafeErr }, { startMemoryLogLoop }] = await Promise.all([
      import("./lib/config.js"),
      import("./bot.js"),
      import("./commands/loader.js"),
      import("./utils/logger.js"),
      import("./utils/memory.js")
    ]);

    console.log("[boot] start", {
      TELEGRAM_BOT_TOKEN: Boolean(cfg.TELEGRAM_BOT_TOKEN),
      TOKEN_API_BASE_URL: Boolean(cfg.TOKEN_API_BASE_URL),
      CHART_IMAGE_BASE_URL: Boolean(cfg.CHART_IMAGE_BASE_URL)
    });

    if (!cfg.TELEGRAM_BOT_TOKEN) {
      console.error("[boot] TELEGRAM_BOT_TOKEN missing. Add it to .env or Render environment and redeploy.");
      process.exit(1);
    }

    const bot = createBot(cfg.TELEGRAM_BOT_TOKEN);
    await bot.init();
    await registerCommands(bot);

    try {
      await bot.api.setMyCommands([
        { command: "start", description: "Welcome and overview" },
        { command: "help", description: "Usage and channel setup" }
      ]);
    } catch (err) {
      console.warn("[boot] setMyCommands failed", { error: helperSafeErr(err) });
    }

    bot.catch((err) => {
      console.error("[bot] middleware error", {
        error: helperSafeErr(err?.error || err)
      });
    });

    startMemoryLogLoop();

    let backoffMs = 2000;

    while (true) {
      try {
        console.log("[polling] cycle start", { backoffMs });
        await bot.api.deleteWebhook({ drop_pending_updates: true });
        console.log("[polling] webhook cleared");

        runnerHandle = run(bot, {
          runner: {
            fetch: {
              allowed_updates: ["message", "channel_post", "edited_channel_post"]
            }
          }
        });

        console.log("[polling] started");
        await runnerHandle.task();
        console.warn("[polling] runner stopped unexpectedly");
      } catch (err) {
        const message = helperSafeErr(err);
        console.error("[polling] failure", { error: message });

        if (String(message).includes("409") || String(message).toLowerCase().includes("conflict")) {
          console.warn("[polling] conflict detected, backing off", { backoffMs });
        }
      } finally {
        try {
          if (runnerHandle) {
            runnerHandle.stop();
          }
        } catch {}
        runnerHandle = null;
      }

      if (restarting) {
        return;
      }

      await sleep(backoffMs);
      backoffMs = Math.min(backoffMs === 2000 ? 5000 : backoffMs * 2, 20000);
    }
  } catch (err) {
    console.error("[boot] error", {
      error: safeErr(err),
      code: err?.code || ""
    });
    process.exit(1);
  }
}

boot();
