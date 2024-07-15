/**
 * 持久化存储管理器
 */
export default class StorageManager {

  public static async get(key: string, encrypt: boolean = false): Promise<NullableValue<any>> {
    try {
      return (await uni.getStorage({ key, encrypt })).data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public static async set(key: string, data: any, encrypt: boolean = false): Promise<void> {
    await uni.setStorage({ key, data, encrypt });
  }

  public static async remove(key: string): Promise<void> {
    await uni.removeStorage({ key });
  }

  public static async clear(): Promise<void> {
    await uni.clearStorage();
  }

}