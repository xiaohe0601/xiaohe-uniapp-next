import to from "await-to-js";

type AndroidPermissionName =
  | "ACCESS_FINE_LOCATION"
  | "ACCESS_COARSE_LOCATION"
  | "CAMERA"
  | "READ_EXTERNAL_STORAGE"
  | "WRITE_EXTERNAL_STORAGE"
  | "RECORD_AUDIO"
  | "READ_CONTACTS"
  | "WRITE_CONTACTS"
  | "READ_CALENDAR"
  | "WRITE_CALENDAR"
  | "READ_SMS"
  | "SEND_SMS"
  | "RECEIVE_SMS"
  | "READ_PHONE_STATE"
  | "CALL_PHONE"
  | "READ_CALL_LOG";

type AndroidPermission = `android.permission.${AndroidPermissionName}`;

const AndroidPermissionResult = {
  /** 已同意 */
  GRANTED: 1,
  /** 已拒绝 */
  DENIED_PRESENT: 0,
  /** 永久拒绝 */
  DENIED_ALWAYS: -1
} as const;

type AndroidPermissionResultType = ExtractValue<typeof AndroidPermissionResult>;

type IosPermission =
  | "location"
  | "push"
  | "camera"
  | "photoLibrary"
  | "record"
  | "contact"
  | "calendar"
  | "memo";

type MpWeixinPermissionName =
  | "userLocation"
  | "userFuzzyLocation"
  | "userLocationBackground"
  | "record"
  | "camera"
  | "bluetooth"
  | "writePhotosAlbum"
  | "addPhoneContact"
  | "addPhoneCalendar"
  | "werun"
  | "address"
  | "invoiceTitle"
  | "invoice"
  | "userInfo";

type MpWeixinPermission = `scope.${MpWeixinPermissionName}`;

// #ifdef APP-PLUS
const OS = plus.os.name;

/**
 * 申请 Android 权限
 */
function requestAndroidPermission(permission: AndroidPermission | string): Promise<AndroidPermissionResultType> {
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
 * 申请 iOS 推送权限是否开启
 */
function requestIosPushPermission() {
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
 * 申请 iOS 定位权限是否开启
 */
function requestIosLocationPermission() {
  const CLLocationManager = plus.ios.importClass("CLLocationManager");
  const status = CLLocationManager.authorizationStatus();
  const result = status !== 2;
  plus.ios.deleteObject(CLLocationManager);
  return result;
}

/**
 * 申请 iOS 麦克风权限是否开启
 */
function requestIosRecordPermission() {
  const AVAudioSession = plus.ios.importClass("AVAudioSession");
  const AVAudio = AVAudioSession.sharedInstance();
  const permission = AVAudio.recordPermission();
  const result = !(permission === 1684369017 || permission === 1970168948);
  plus.ios.deleteObject(AVAudioSession);
  return result;
}

/**
 * 申请 iOS 相机权限是否开启
 */
function requestIosCameraPermission() {
  const AVCaptureDevice = plus.ios.importClass("AVCaptureDevice");
  const status = AVCaptureDevice.authorizationStatusForMediaType("vide");
  const result = status === 3;
  plus.ios.deleteObject(AVCaptureDevice);
  return result;
}

/**
 * 申请 iOS 相册权限是否开启
 */
function requestIosPhotoLibraryPermission() {
  const PHPhotoLibrary = plus.ios.importClass("PHPhotoLibrary");
  const status = PHPhotoLibrary.authorizationStatus();
  const result = status === 3;
  plus.ios.deleteObject(PHPhotoLibrary);
  return result;
}

/**
 * 申请 iOS 通讯录权限是否开启
 */
function requestIosContactPermission() {
  const CNContactStore = plus.ios.importClass("CNContactStore");
  const status = CNContactStore.authorizationStatusForEntityType(0);
  const result = status === 3;
  plus.ios.deleteObject(CNContactStore);
  return result;
}

/**
 * 申请 iOS 日历权限是否开启
 */
function requestIosCalendarPermission() {
  const EKEventStore = plus.ios.importClass("EKEventStore");
  const status = EKEventStore.authorizationStatusForEntityType(0);
  const result = status === 3;
  plus.ios.deleteObject(EKEventStore);
  return result;
}

/**
 * 申请 iOS 备忘录权限是否开启
 */
function requestIosMemoPermission() {
  const EKEventStore = plus.ios.importClass("EKEventStore");
  const status = EKEventStore.authorizationStatusForEntityType(1);
  const result = status === 3;
  plus.ios.deleteObject(EKEventStore);
  return result;
}

/**
 * 申请 iOS 权限
 */
function requestIosPermission(permission: IosPermission | string) {
  switch (permission) {
    case "location": {
      return requestIosLocationPermission();
    }
    case "camera": {
      return requestIosCameraPermission();
    }
    case "photoLibrary": {
      return requestIosPhotoLibraryPermission();
    }
    case "record": {
      return requestIosRecordPermission();
    }
    case "push": {
      return requestIosPushPermission();
    }
    case "contact": {
      return requestIosContactPermission();
    }
    case "calendar": {
      return requestIosCalendarPermission();
    }
    case "memo": {
      return requestIosMemoPermission();
    }
  }

  return false;
}

/**
 * 跳转到权限设置页面
 */
function gotoAppPermissionSettings() {
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
export function checkAppSystemLocationEnable() {
  if (OS === "iOS") {
    const CLLocationManager = plus.ios.importClass("CLLocationManager");
    const enabled = CLLocationManager.locationServicesEnabled();
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
async function requestMpWeixinPermission(permission: MpWeixinPermission | string) {
  const { authSetting } = await uni.getSetting();

  // @ts-expect-error whatever
  if (authSetting[permission]) {
    return true;
  }

  const [error] = await to(uni.authorize({
    scope: permission
  }));

  if (error) {
    console.warn(error);
    return false;
  }

  return true;
}
// #endif

interface RequestUnifiedPermissionScope {
  /** Android权限 */
  android?: AndroidPermission | string;
  /** iOS权限 */
  ios?: IosPermission | string;
  /** 微信小程序权限 */
  mpWeixin?: MpWeixinPermission | string;
}

interface RequestUnifiedPermissionOptions {
  /** 拒绝授权时是否跳转至设置页 */
  settings?: boolean;
  /** 申请权限弹窗标题 */
  modalTitle?: string;
  /** 申请权限弹窗内容 */
  modalContent?: string;
}

/**
 * 统一权限获取
 */
export async function requestUnifiedPermission(
  scope: RequestUnifiedPermissionScope,
  options: RequestUnifiedPermissionOptions = {}
) {
  const {
    settings = true,
    modalTitle = "权限申请",
    modalContent = ""
  } = options;

  // #ifdef MP-WEIXIN
  if (scope.mpWeixin == null || isEmpty(scope.mpWeixin)) {
    return;
  }

  if (await requestMpWeixinPermission(scope.mpWeixin)) {
    return;
  }
  // #endif

  // #ifdef APP-PLUS
  if (OS === "Android") {
    if (scope.android == null || isEmpty(scope.android)) {
      return;
    }

    if (await requestAndroidPermission(scope.android) === AndroidPermissionResult.GRANTED) {
      return;
    }
  }

  if (OS === "iOS") {
    if (scope.ios == null || isEmpty(scope.ios)) {
      return;
    }

    if (requestIosPermission(scope.ios)) {
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
      gotoAppPermissionSettings();
      // #endif
    }
  }

  return Promise.reject();
}