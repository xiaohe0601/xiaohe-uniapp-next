// noinspection JSUnresolvedReference

// #ifdef APP-PLUS
const OS = plus.os.name;
// #endif

/**
 * Android权限
 */
export type AndroidPermission =
  "android.permission.ACCESS_FINE_LOCATION"
  | "android.permission.ACCESS_COARSE_LOCATION"
  | "android.permission.CAMERA"
  | "android.permission.READ_EXTERNAL_STORAGE"
  | "android.permission.WRITE_EXTERNAL_STORAGE"
  | "android.permission.RECORD_AUDIO"
  | "android.permission.READ_CONTACTS"
  | "android.permission.WRITE_CONTACTS"
  | "android.permission.READ_CALENDAR"
  | "android.permission.WRITE_CALENDAR"
  | "android.permission.READ_SMS"
  | "android.permission.SEND_SMS"
  | "android.permission.RECEIVE_SMS"
  | "android.permission.READ_PHONE_STATE"
  | "android.permission.CALL_PHONE"
  | "android.permission.READ_CALL_LOG";

/**
 * Android权限申请结果
 */
export enum AndroidPermissionResult {
  /**
   * 已同意
   */
  GRANTED = 1,
  /**
   * 已拒绝
   */
  DENIED_PRESENT = 0,
  /**
   * 永久拒绝
   */
  DENIED_ALWAYS = -1
}

/**
 * iOS权限
 */
export type IosPermission =
  "location"
  | "push"
  | "camera"
  | "photoLibrary"
  | "record"
  | "contact"
  | "calendar"
  | "memo";

/**
 * 微信小程序权限
 */
export type MpWeixinPermission =
  "scope.userLocation"
  | "scope.userFuzzyLocation"
  | "scope.userLocationBackground"
  | "scope.record"
  | "scope.camera"
  | "scope.bluetooth"
  | "scope.writePhotosAlbum"
  | "scope.addPhoneContact"
  | "scope.addPhoneCalendar"
  | "scope.werun"
  | "scope.address"
  | "scope.invoiceTitle"
  | "scope.invoice"
  | "scope.userInfo";

// #ifdef APP-PLUS
/**
 * 申请Android权限
 */
export function requestAndroidPermission(permission: AndroidPermission | string): Promise<AndroidPermissionResult> {
  return new Promise((resolve) => {
    plus.android.requestPermissions(
      [permission],
      ({ deniedPresent, deniedAlways }) => {
        if (deniedAlways.length > 0) {
          resolve(AndroidPermissionResult.DENIED_ALWAYS);
        } else if (deniedPresent.length > 0) {
          resolve(AndroidPermissionResult.DENIED_PRESENT);
        } else {
          resolve(AndroidPermissionResult.GRANTED);
        }
      },
      () => {
        resolve(AndroidPermissionResult.DENIED_PRESENT);
      }
    );
  });
}

/**
 * 判断iOS推送权限是否开启
 */
function judgeIosPermissionPush(): boolean {
  const UIApplication = plus.ios.importClass("UIApplication");
  const app = UIApplication.sharedApplication();
  let result: boolean;
  if (app.currentUserNotificationSettings) {
    const settings = app.currentUserNotificationSettings();
    result = settings.plusGetAttribute("types") !== 0;
    plus.ios.deleteObject(settings);
  } else {
    result = app.enabledRemoteNotificationTypes() !== 0;
  }
  plus.ios.deleteObject(app);
  plus.ios.deleteObject(UIApplication);
  return result;
}

/**
 * 判断iOS定位权限是否开启
 */
function judgeIosPermissionLocation(): boolean {
  const CLLocationManager = plus.ios.importClass("CLLocationManager");
  const status = CLLocationManager.authorizationStatus();
  const result: boolean = status !== 2;
  plus.ios.deleteObject(CLLocationManager);
  return result;
}

/**
 * 判断iOS麦克风权限是否开启
 */
function judgeIosPermissionRecord(): boolean {
  const AVAudioSession = plus.ios.importClass("AVAudioSession");
  const AVAudio = AVAudioSession.sharedInstance();
  const permission = AVAudio.recordPermission();
  const result: boolean = !(permission === 1684369017 || permission === 1970168948);
  plus.ios.deleteObject(AVAudioSession);
  return result;
}

/**
 * 判断iOS相机权限是否开启
 */
function judgeIosPermissionCamera(): boolean {
  const AVCaptureDevice = plus.ios.importClass("AVCaptureDevice");
  const status = AVCaptureDevice.authorizationStatusForMediaType("vide");
  const result: boolean = status === 3;
  plus.ios.deleteObject(AVCaptureDevice);
  return result;
}

/**
 * 判断iOS相册权限是否开启
 */
function judgeIosPermissionPhotoLibrary(): boolean {
  const PHPhotoLibrary = plus.ios.importClass("PHPhotoLibrary");
  const status = PHPhotoLibrary.authorizationStatus();
  const result: boolean = status === 3;
  plus.ios.deleteObject(PHPhotoLibrary);
  return result;
}

/**
 * 判断iOS通讯录权限是否开启
 */
function judgeIosPermissionContact(): boolean {
  const CNContactStore = plus.ios.importClass("CNContactStore");
  const status = CNContactStore.authorizationStatusForEntityType(0);
  const result: boolean = status === 3;
  plus.ios.deleteObject(CNContactStore);
  return result;
}

/**
 * 判断iOS日历权限是否开启
 */
function judgeIosPermissionCalendar(): boolean {
  const EKEventStore = plus.ios.importClass("EKEventStore");
  const status = EKEventStore.authorizationStatusForEntityType(0);
  const result: boolean = status === 3;
  plus.ios.deleteObject(EKEventStore);
  return result;
}

/**
 * 判断iOS备忘录权限是否开启
 */
function judgeIosPermissionMemo(): boolean {
  const EKEventStore = plus.ios.importClass("EKEventStore");
  const status = EKEventStore.authorizationStatusForEntityType(1);
  const result: boolean = status === 3;
  plus.ios.deleteObject(EKEventStore);
  return result;
}

/**
 * 申请iOS权限
 */
export function judgeIosPermission(permission: IosPermission | string): boolean {
  switch (permission) {
    case "location":
      return judgeIosPermissionLocation();
    case "camera":
      return judgeIosPermissionCamera();
    case "photoLibrary":
      return judgeIosPermissionPhotoLibrary();
    case "record":
      return judgeIosPermissionRecord();
    case "push":
      return judgeIosPermissionPush();
    case "contact":
      return judgeIosPermissionContact();
    case "calendar":
      return judgeIosPermissionCalendar();
    case "memo":
      return judgeIosPermissionMemo();
  }
  return false;
}

/**
 * 跳转到权限设置页面
 */
export function gotoAppPermissionSetting(): void {
  if (OS === "iOS") {
    const UIApplication = plus.ios.importClass("UIApplication");
    const app = UIApplication.sharedApplication();
    const NSURL = plus.ios.importClass("NSURL");
    const settings = NSURL.URLWithString("app-settings:");
    app.openURL(settings);

    plus.ios.deleteObject(settings);
    plus.ios.deleteObject(NSURL);
    plus.ios.deleteObject(app);
  } else {
    const Intent = plus.android.importClass("android.content.Intent");
    const Settings = plus.android.importClass("android.provider.Settings");
    const Uri = plus.android.importClass("android.net.Uri");
    const main = plus.android.runtimeMainActivity();
    // @ts-expect-error whatever
    const intent = new Intent();
    // @ts-expect-error whatever
    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
    // @ts-expect-error whatever
    intent.setData(Uri.fromParts("package", main.getPackageName(), null));
    // @ts-expect-error whatever
    main.startActivity(intent);
  }
}

/**
 * 检查系统的设备服务是否开启
 */
export function checkSystemEnableLocation(): boolean {
  if (OS === "iOS") {
    const CLLocationManager = plus.ios.importClass("CLLocationManager");
    const enabled: boolean = CLLocationManager.locationServicesEnabled();
    plus.ios.deleteObject(CLLocationManager);
    return enabled;
  } else {
    const Context = plus.android.importClass("android.content.Context");
    const LocationManager = plus.android.importClass("android.location.LocationManager");
    const main = plus.android.runtimeMainActivity();
    // @ts-expect-error whatever
    return main.getSystemService(Context.LOCATION_SERVICE).isProviderEnabled(LocationManager.GPS_PROVIDER);
  }
}

// #endif

// #ifdef MP-WEIXIN
/**
 * 申请微信小程序权限
 */
export async function authorizeMpWeixinPermission(permission: MpWeixinPermission | string): Promise<boolean> {
  const { authSetting } = await uni.getSetting();

  // @ts-expect-error whatever
  if (authSetting[permission]) {
    return true;
  }

  try {
    await uni.authorize({
      scope: permission
    });
  } catch (error) {
    console.warn(error);

    return false;
  }

  return true;
}

// #endif

interface RequestUnifiedPermissionScope {
  /**
   * Android权限
   */
  android?: AndroidPermission | string;
  /**
   * iOS权限
   */
  ios?: IosPermission | string;
  /**
   * 微信小程序权限
   */
  mpWeixin?: MpWeixinPermission | string;
}

interface RequestUnifiedPermissionOptions {
  /**
   * 拒绝授权时是否跳转至设置页
   */
  settings?: boolean;
  /**
   * 申请权限弹窗标题
   */
  modalTitle?: string;
  /**
   * 申请权限弹窗内容
   */
  modalContent?: string;
}

/**
 * 统一权限获取
 *
 * @param scope     需要获取权限的scope
 * @param options   授权请求配置
 */
export async function requestUnifiedPermission(scope: RequestUnifiedPermissionScope, options: RequestUnifiedPermissionOptions): Promise<void> {
  const { settings, modalTitle, modalContent } = Object.assign({}, {
    settings: true,
    modalTitle: "权限申请",
    modalContent: ""
  } satisfies RequestUnifiedPermissionOptions, options);

  // #ifdef MP-WEIXIN
  if (scope.mpWeixin == null) {
    return;
  }

  if (await authorizeMpWeixinPermission(scope.mpWeixin)) {
    return;
  }
  // #endif

  // #ifdef APP-PLUS
  if (OS === "Android") {
    if (scope.android == null) {
      return;
    }

    if (await requestAndroidPermission(scope.android) === AndroidPermissionResult.GRANTED) {
      return;
    }
  }

  if (OS === "iOS") {
    if (scope.ios == null) {
      return;
    }

    if (judgeIosPermission(scope.ios)) {
      return;
    }
  }
  // #endif

  if (settings) {
    const { confirm } = await uni.showModal({
      title: modalTitle,
      content: modalContent
    });

    if (confirm) {
      // #ifdef MP-WEIXIN
      const { authSetting } = await uni.openSetting();

      if (authSetting[scope.mpWeixin]) {
        return;
      }
      // #endif

      // #ifdef APP-PLUS
      gotoAppPermissionSetting();
      // #endif
    }
  }

  return Promise.reject("权限申请被拒绝");
}