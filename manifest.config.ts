import process from "node:process";
import type { H5 as H5Config } from "@uni-helper/vite-plugin-uni-manifest";
import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV, process.cwd());

export default defineManifestConfig({
  name: env.VITE_PLATFORM_NAME,
  appid: env.VITE_UNI_APPID,
  description: "",
  versionName: env.VITE_VERSION_NAME,
  versionCode: env.VITE_VERSION_CODE,
  vueVersion: "3",
  h5: {
    router: {
      mode: env.VITE_WEB_ROUTER_MODE as H5Config["router"]["mode"],
      base: env.VITE_WEB_BASE_URL
    },
    optimization: {
      prefetch: true,
      preload: true,
      treeShaking: {
        enable: true
      }
    }
  },
  "app-plus": {
    compilerVersion: 3,
    nvueCompiler: "uni-app",
    nvueStyleCompiler: "uni-app",
    runmode: "liberate",
    optimization: {
      subPackages: true
    },
    distribute: {
      android: {
        permissions: [
          `<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>`,
          `<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>`,
          `<uses-permission android:name="android.permission.VIBRATE"/>`,
          `<uses-permission android:name="android.permission.READ_LOGS"/>`,
          `<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>`,
          `<uses-feature android:name="android.hardware.camera.autofocus"/>`,
          `<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>`,
          `<uses-permission android:name="android.permission.CAMERA"/>`,
          `<uses-permission android:name="android.permission.GET_ACCOUNTS"/>`,
          `<uses-permission android:name="android.permission.READ_PHONE_STATE"/>`,
          `<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>`,
          `<uses-permission android:name="android.permission.WAKE_LOCK"/>`,
          `<uses-permission android:name="android.permission.FLASHLIGHT"/>`,
          `<uses-feature android:name="android.hardware.camera"/>`,
          `<uses-permission android:name="android.permission.WRITE_SETTINGS"/>`
        ],
        abiFilters: [
          "armeabi-v7a",
          "arm64-v8a",
          "x86"
        ]
      },
      ios: {},
      sdkConfigs: {}
    },
    modules: {}
  },
  "mp-weixin": {
    appid: env.VITE_WEIXIN_APPID,
    setting: {
      urlCheck: false
    },
    optimization: {
      subPackages: true
    },
    mergeVirtualHostAttributes: true,
    lazyCodeLoading: "requiredComponents"
  }
});