<template>
  <NutDialog
    ref="dialog"
    v-model:visible="innerVisible"
    :title="mergedProps.title"
    :content="mergedProps.content"
    :ok-text="mergedProps.okText"
    :cancel-text="mergedProps.cancelText"
    :text-align="mergedProps.textAlign"
    :footer-direction="mergedProps.footerDirection"
    :no-ok-btn="mergedProps.noOkBtn"
    :no-cancel-btn="mergedProps.noCancelBtn"
    :no-footer="mergedProps.noFooter"
    :lock-scroll="mergedProps.lockScroll"
    :cancel-auto-close="mergedProps.cancelAutoClose"
    :close-on-click-overlay="mergedProps.closeOnClickOverlay"
    :z-index="mergedProps.zIndex"
    :overlay-class="overlayClass"
    :overlay-style="mergedProps.overlayStyle"
    :pop-class="popupClass"
    :pop-style="mergedProps.popStyle"
    :transition="mergedProps.transition"
    :before-close="mergedProps.beforeClose"
    @ok="onOk"
    @cancel="onCancel"
    @opened="onOpened"
    @closed="onClosed">
    <template #header>
      <view class="app-dialog__header__wrapper">
        <slot v-if="$slots.header" name="header"></slot>

        <text v-else class="app-dialog__header">{{ mergedProps.title }}</text>
      </view>
    </template>

    <view class="app-dialog__content__wrapper">
      <slot v-if="$slots.default"></slot>

      <text v-else class="app-dialog__content">{{ mergedProps.content }}</text>
    </view>

    <template #footer>
      <view class="app-dialog__footer__wrapper">
        <slot v-if="$slots.footer" name="footer"></slot>

        <view v-else class="app-dialog__footer" :class="[`is-${mergedProps.footerDirection}`]">
          <AppButton
            v-if="!mergedProps.noCancelBtn"
            class="app-dialog__footer__button is-cancel"
            type="primary"
            plain
            @click="cancel">{{ mergedProps.cancelText }}
          </AppButton>

          <AppButton
            v-if="!mergedProps.noOkBtn"
            class="app-dialog__footer__button is-ok"
            type="primary"
            @click="ok">{{ mergedProps.okText }}
          </AppButton>
        </view>
      </view>
    </template>
  </NutDialog>
</template>

<script lang="ts" setup>
import type { DialogInst } from "nutui-uniapp";
import type { Callback, Emits, Props, Slots } from "./types.ts";
import { merge } from "@/plugins/lodash.ts";

defineOptions({
  name: "AppDialog",
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
});

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: "提示",
  content: "",
  okText: "确认",
  cancelText: "取消",
  textAlign: "center",
  footerDirection: "horizontal",
  noOkBtn: false,
  noCancelBtn: false,
  noFooter: false,
  lockScroll: true,
  cancelAutoClose: true,
  closeOnClickOverlay: false,
  zIndex: 3000,
  overlayClass: "",
  popClass: ""
});

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const dialog = ref<NullableValue<DialogInst>>(null);

const customProps = ref<Props>({});

const mergedProps = computed<Props>(() => {
  return merge({}, props, customProps.value);
});

const innerVisible = computed({
  get() {
    return mergedProps.value.visible!;
  },
  set(value) {
    emit("update:visible", value);
  }
});

const popupClass = computed(() => {
  return `app-dialog ${mergedProps.value.popClass}`;
});

const overlayClass = computed(() => {
  return `app-dialog-overlay ${mergedProps.value.overlayClass}`;
});

const callback: Callback = {
  resolve: null,
  reject: null
};

function onOk(): void {
  emit("ok");

  callback.resolve?.();

  clearCallback();
}

function onCancel(): void {
  emit("cancel");

  callback.reject?.();

  clearCallback();
}

function clearCallback(): void {
  callback.resolve = null;
  callback.reject = null;
}

function onOpened(): void {
  emit("opened");
}

function onClosed(): void {
  emit("closed");
}

function show(options?: Props): Promise<void> {
  return new Promise((resolve, reject) => {
    customProps.value = options ?? {};

    dialog.value?.showDialog(mergedProps.value);

    callback.resolve = resolve;
    callback.reject = reject;
  });
}

async function confirm(options?: Props): Promise<void> {
  return await show(Object.assign({
    title: "提示",
    okText: "确认",
    cancelText: "取消",
    noOkBtn: false,
    noCancelBtn: false,
    noFooter: false
  } satisfies Props, options));
}

async function alert(options?: Props): Promise<void> {
  return await show(Object.assign({
    title: "提示",
    okText: "确认",
    noOkBtn: false,
    noCancelBtn: true,
    noFooter: false
  } satisfies Props, options));
}

function ok(): void {
  dialog.value?.onOk();
}

function cancel(): void {
  dialog.value?.onCancel();
}

defineExpose({
  show,
  confirm,
  alert,
  ok,
  cancel
});
</script>

<style lang="scss" noscoped>
.app-dialog {
  --nut-dialog-width: 660rpx;
  --nut-popup-border-radius: 20rpx;

  .nut-dialog {
    --at-apply: items-stretch px-0 py-10rpx min-h-0;
  }

  .nut-dialog__header {
    --at-apply: h-88rpx text-34rpx text-t1 font-medium ws-normal;
  }

  .nut-dialog__content {
    --at-apply: "flex-[0_1_auto] max-h-none m-0 text-30rpx text-t2 overflow-visible";
  }

  .nut-dialog__footer {
    --at-apply: items-stretch justify-stretch;
  }
}

.app-dialog__header__wrapper {
  --at-apply: flex items-center w-full h-full px-30rpx;
}

.app-dialog__content__wrapper {
  --at-apply: flex items-center w-full min-h-160rpx max-h-500rpx px-30rpx overflow-y-auto;
}

.app-dialog__footer__wrapper {
  --at-apply: w-full px-30rpx py-20rpx;
}
</style>

<style lang="scss" scoped>
.app-dialog__header {
  --at-apply: w-full truncate;
}

.app-dialog__content {
  --at-apply: w-full leading-snug;
}

.app-dialog__footer {
  --at-apply: flex items-center w-full;

  &.is-horizontal {
    --at-apply: flex-row justify-around;

    .app-dialog__footer__button {
      --nut-button-default-height: 66rpx;

      & + .app-dialog__footer__button {
        --at-apply: ml-20rpx;
      }
    }
  }

  &.is-vertical {
    --at-apply: flex-col;

    .app-dialog__footer__button {
      --nut-button-default-height: 72rpx;

      & + .app-dialog__footer__button {
        --at-apply: mt-20rpx;
      }
    }
  }
}

.app-dialog__footer__button {
  --at-apply: tracking-4rpx;
}
</style>