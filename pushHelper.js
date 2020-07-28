import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';

export const checkAndroidPushPermission = async () => {
  await messaging()
    .hasPermission()
    .then((enabled) => {
      return enabled;
    });
};

export const requestAndroidPushPermission = async () => {
  await messaging()
    .requestPermission()
    .then(() => {
      getAndroidPushToken();
    })
    .catch((error) => {});
};

export const getAndroidPushToken = async () => {
  await messaging()
    .getToken()
    .then((fcmToken) => {
      if (fcmToken) {
        console.log('FcmToken::' + fcmToken);
      }
    });
};

export const checkiOSPushPermission = async () => {
  await PushNotificationIOS.checkPermissions(
    (permissionCallback = (permissions) => {
      if (permissions.alert && permissions.badge && permissions.sound) {
        getiOSPushToken();
      } else {
        requestiOSPushPermission();
      }
    }),
  );
};

export const requestiOSPushPermission = async () => {
  await PushNotificationIOS.requestPermissions()
    .then(() => {
      getiOSPushToken();
    })
    .catch((error) => {});
};

export const getiOSPushToken = async () => {
  await PushNotificationIOS.addEventListener('register', function (token) {
    console.log('APNS::' + token);
  });
};
