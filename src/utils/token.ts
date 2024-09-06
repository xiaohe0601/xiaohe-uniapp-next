import { STORAGE_TOKEN_KEY } from "@/constants/storage.ts";
import StorageManager from "@/utils/storage.ts";

/**
 * TOKEN管理器
 */
export default class TokenManager {

  /**
   * TOKEN
   *
   * @private
   */
  static #token?: NullableString = undefined;

  /**
   * 获取TOKEN
   */
  public static async get(): Promise<NullableString> {
    if (TokenManager.#token !== undefined) {
      return TokenManager.#token;
    }

    return TokenManager.#token = await StorageManager.get(STORAGE_TOKEN_KEY) || null;
  }

  /**
   * 更新TOKEN
   *
   * @param token TOKEN
   */
  public static async set(token: string): Promise<void> {
    TokenManager.#token = token;

    await StorageManager.set(STORAGE_TOKEN_KEY, token);
  }

  /**
   * 移除TOKEN
   */
  public static async remove(): Promise<void> {
    TokenManager.#token = null;

    await StorageManager.remove(STORAGE_TOKEN_KEY);
  }

}