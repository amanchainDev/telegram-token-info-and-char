import { InputFile } from "grammy";
import { detectFirstContract } from "../utils/contracts.js";
import { fetchTokenDetails } from "../services/tokenLookup.js";
import { fetchChartImage } from "../services/chartService.js";
import { formatTokenSummary } from "../utils/messageFormatter.js";
import { logError, logInfo, logWarn, safeErr } from "../utils/logger.js";

const inFlightKeys = new Set();

export function registerChannelHandlers(bot) {
  bot.on(["channel_post", "edited_channel_post"], async (ctx) => {
    const post = ctx.update.channel_post || ctx.update.edited_channel_post;
    if (!post) return;

    const chatId = post.chat?.id;
    const messageId = post.message_id;
    const text = [post.text || "", post.caption || ""].filter(Boolean).join("\n");

    logInfo("[channel] scan start", {
      chatId,
      messageId,
      edited: Boolean(ctx.update.edited_channel_post)
    });

    const match = detectFirstContract(text);
    logInfo("[channel] scan result", {
      chatId,
      messageId,
      detected: Boolean(match)
    });

    if (!match) {
      return;
    }

    const lockKey = `${chatId}:${messageId}:${match.address}`;
    if (inFlightKeys.has(lockKey)) {
      return;
    }

    inFlightKeys.add(lockKey);

    try {
      const token = await fetchTokenDetails(match.address);
      logInfo("[token] lookup success", {
        contract: match.address,
        symbol: token.symbol,
        chain: token.chain
      });

      const caption = formatTokenSummary(token);

      try {
        const chartBuffer = await fetchChartImage(token);
        logInfo("[chart] fetch success", {
          contract: token.address,
          bytes: chartBuffer.length
        });

        try {
          await ctx.api.sendPhoto(chatId, new InputFile(chartBuffer, "chart.png"), {
            caption,
            reply_parameters: { message_id: messageId }
          });
        } catch (err) {
          logWarn("[send] photo failed, fallback to text", {
            contract: token.address,
            error: safeErr(err)
          });
          await sendTextFallback(ctx, chatId, messageId, caption, token.chartUrl);
        }
      } catch (err) {
        logWarn("[chart] fetch failure", {
          contract: token.address,
          error: safeErr(err)
        });
        await sendTextFallback(ctx, chatId, messageId, caption, token.chartUrl);
      }
    } catch (err) {
      const error = safeErr(err);
      logError("[token] lookup failure", {
        contract: match.address,
        error
      });

      if (shouldReplyOnLookupFailure(text, error)) {
        try {
          await ctx.api.sendMessage(chatId, "I found a contract-looking address, but token data is unavailable right now.", {
            reply_parameters: { message_id: messageId }
          });
        } catch (sendErr) {
          logWarn("[send] failure notice failed", {
            contract: match.address,
            error: safeErr(sendErr)
          });
        }
      }
    } finally {
      inFlightKeys.delete(lockKey);
    }
  });
}

async function sendTextFallback(ctx, chatId, messageId, caption, chartUrl) {
  const text = chartUrl ? `${caption}\nChart link: ${chartUrl}` : caption;
  logInfo("[send] using text fallback", {
    chatId,
    messageId,
    hasChartUrl: Boolean(chartUrl)
  });
  await ctx.api.sendMessage(chatId, text, {
    reply_parameters: { message_id: messageId }
  });
}

function shouldReplyOnLookupFailure(sourceText, error) {
  const lower = String(sourceText || "").toLowerCase();
  if (lower.includes("0x") && !String(error).toLowerCase().includes("unsupported")) {
    return true;
  }
  return false;
}
