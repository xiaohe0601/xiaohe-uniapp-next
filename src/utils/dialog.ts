import type { Inst as DialogInst, Props as DialogProps } from "@/components/AppDialog/types.ts";
import PagesManager from "@/utils/pages.ts";

export default class DialogManager {

  public static async instance(): Promise<NullableValue<DialogInst>> {
    return (await PagesManager.requireStackTopPage())?.$vm?.$magic?.dialog?.value ?? null;
  }

  public static async show(options?: DialogProps): Promise<void> {
    const instance: NullableValue<DialogInst> = await DialogManager.instance();

    await instance?.show(options);
  }

  public static async confirm(options?: DialogProps): Promise<void> {
    const instance: NullableValue<DialogInst> = await DialogManager.instance();

    await instance?.confirm(options);
  }

  public static async alert(options?: DialogProps): Promise<void> {
    const instance: NullableValue<DialogInst> = await DialogManager.instance();

    await instance?.alert(options);
  }

  public static async ok(): Promise<void> {
    const instance: NullableValue<DialogInst> = await DialogManager.instance();

    instance?.ok();
  }

  public static async cancel(): Promise<void> {
    const instance: NullableValue<DialogInst> = await DialogManager.instance();

    instance?.cancel();
  }

}