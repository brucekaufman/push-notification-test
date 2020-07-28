/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text, Platform} from 'react-native';

import * as PushHelper from './pushHelper';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';

const App = (props) => {
  const [notificationBody, setNotificationBody] = useState('Notification body');
  //mounted
  useEffect(() => handleComponentMounted(), []);

  const handleComponentMounted = () => {
    if (Platform.OS === 'ios') {
      PushHelper.checkiOSPushPermission();
      PushNotificationIOS.addEventListener('notification', _onNotification());
    } else {
      const isAndroidPushPermissionEnabled = PushHelper.checkAndroidPushPermission();
      if (isAndroidPushPermissionEnabled) {
        PushHelper.getAndroidPushToken();
      } else {
        PushHelper.requestAndroidPushPermission();
      }
      createNotificationListeners();
      messaging().onTokenRefresh((fcmToken) => {
        console.log('Updated FcmToken::' + fcmToken);
      });
    }
  };
  //unmount
  useEffect(() => {
    return () => {
      handleComponentUnmount();
    };
  }, []);

  const handleComponentUnmount = () => {
    PushNotificationIOS.removeEventListener('notification', _onNotification());
  };

  const _onNotification = (notification) => {
    if (notification) {
    } else {
    }
  };

  const createNotificationListeners = async () => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('remoteMessage::' + JSON.stringify(remoteMessage));
      let body;
      if (remoteMessage.data) {
        body = remoteMessage.data.message
          ? remoteMessage.data.message
          : remoteMessage.data.default;
      } else {
        body = 'missing body!';
      }
      setNotificationBody(body);
    });
    return unsubscribe;
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.viewContainer}>
        <Text>{notificationBody}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
