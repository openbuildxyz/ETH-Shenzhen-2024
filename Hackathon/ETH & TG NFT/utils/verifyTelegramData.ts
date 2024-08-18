import { WebAppUser } from "@vkruglikov/react-telegram-web-app";
import crypto from "crypto";

/**
 * @doc https://core.telegram.org/bots/webapps#direct-link-mini-apps
 */
export const verifyTelegramData = async (
  telegramInitData: string,
): Promise<WebAppUser> => {
  const token = process.env.NEXT_PUBLIC_BOT_API_TOKEN!;
  const secret = crypto.createHmac("sha256", "WebAppData").update(token);
  try {
    const params = new URLSearchParams(telegramInitData);
    const hash = params.get("hash");
    params.delete("hash");
    params.sort();

    const dataCheckString = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const _hash = crypto
      .createHmac("sha256", secret.digest())
      .update(dataCheckString)
      .digest("hex");

    console.log(">>>>>", _hash, hash)
    if (_hash === hash) {
      const user = JSON.parse(params.get("user")!);
      return user;
    } else {
      throw new Error("Invalid Telegram Data");
    }
  } catch (error: any) {
    throw new Error("Invalid Telegram Data:" + error.message);
  }
};
