import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";

export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [customPushToken, setCustomPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const [notificationCount, setNotificationCount] = useState(0);
  const [customMessage, setCustomMessage] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? "")) // Store expo push token
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        setNotificationCount((prev) => prev + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
        // Handle user tapping on notification
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="notifications" size={32} color="#4A90E2" />
          <Text style={styles.headerText}>Notifications</Text>
        </View>
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>Your Expo Push Token:</Text>
        <Text style={styles.tokenText}>{expoPushToken}</Text>
      </View>

      {notification && (
        <Animated.View style={[styles.notificationCard, { opacity: fadeAnim }]}>
          <Text style={styles.notificationTitle}>
            {notification.request.content.title}
          </Text>
          <Text style={styles.notificationBody}>
            {notification.request.content.body}
          </Text>
          <Text style={styles.notificationData}>
            Data: {JSON.stringify(notification.request.content.data)}
          </Text>
        </Animated.View>
      )}

      {/* Custom Push Token Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter push token (optional)"
        placeholderTextColor="#999"
        value={customPushToken}
        onChangeText={setCustomPushToken}
      />

      {/* Custom Message Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter custom message"
        placeholderTextColor="#999"
        value={customMessage}
        onChangeText={setCustomMessage}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          const tokenToUse = customPushToken.trim() || expoPushToken;
          if (!tokenToUse) {
            alert("No push token available!");
            return;
          }
          await sendPushNotification(tokenToUse, customMessage);
        }}
      >
        <Text style={styles.buttonText}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  badge: {
    backgroundColor: "#FF3B30",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  tokenContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tokenLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  tokenText: {
    fontSize: 14,
    color: "#333",
  },
  notificationCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  notificationBody: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  notificationData: {
    fontSize: 14,
    color: "#999",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    color: "#333",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

async function sendPushNotification(expoPushToken, message) {
  if (!message.trim()) {
    alert("Please enter a message!");
    return;
  }

  const notificationMessage = {
    to: expoPushToken,
    sound: "default",
    title: "New Notification",
    body: message,
    data: { customData: "any additional data" },
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationMessage),
    });

    const responseData = await response.json();

    // Check if there was an error in the response
    if (!response.ok || responseData.errors) {
      throw new Error(
        responseData.errors ? responseData.errors[0].message : "Unknown error"
      );
    }

    console.log("Notification sent successfully:", responseData);
  } catch (error) {
    console.error("Error sending notification:", error);
    alert(`Error sending notification: ${error.message}`);
  }
}

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
