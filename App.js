import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

// Note - Push Notification server an Important thing
// google and Apple basicaly providr these server to avoid spam
// expo push notification server
// documentation

export default function App() {
  useEffect(() => {
    async function configurePushNotification() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus == "granted") {
        Alert.alert(
          "Permission required",
          "Push notification need the appropriate permissions"
        );
        return;
      }

      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);

      if(Platform.OS === 'android'){
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT
        })
      }
    }

    configurePushNotification();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Recevied");
        console.log(notification);
        const userName = notification.request.content.data.userName;
        console.log(userName);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification RESPONSE RECEVIED");
        console.log(response);
        const userName = response.notification.request.content.data.userName;
        console.log(userName);
      }
    );

    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  // to save the memory we are using return and deleting subscription

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification",
        data: { userName: "Max" },
      },
      trigger: {
        seconds: 5,
      },
    });
  }


function sendPushNotificationHandler(){
  fetch('https://exp.host/--/api/v2/push/send',{
    method: 'POST',
    headers:{
      'Content-Type': 'appilication/json'
    },
    body: JSON.stringify({
        to: '',
        title: 'Test - sent from a device!',
        body: 'This is a test!'
    })
  })
}

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <Button title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// expo_notofication package
//local & push can be used in both notification
