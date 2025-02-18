import React, { useEffect } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions, PermissionStatus } from "expo-camera";

const Home = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  useEffect(() => {
    if (permission?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Camera Permission Required",
        "You need to grant camera access to scan QR codes.",
        [{ text: "OK" }]
      );
    }
  }, [permission]);

  const handlePermissionRequest = async () => {
    const result = await requestPermission();
    if (result.granted) {
      Alert.alert("Permission Granted", "You can now scan QR codes.");
    } else {
      Alert.alert(
        "Permission Denied",
        "Please enable camera access in settings."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Scanner App</Text>
      <Text style={styles.description}>
        Grant camera permission to start scanning QR codes.
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handlePermissionRequest}
          style={styles.permissionButton}
        >
          <Text style={styles.buttonText}>Request Permission</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Notification")}
          style={styles.notificationButton}
        >
          <Text style={styles.buttonText}>Go to Notifications</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("ScannerScreen")}
          disabled={!permission?.granted}
          style={[
            styles.scanButton,
            { opacity: permission?.granted ? 1 : 0.5 },
          ]}
        >
          <Text style={styles.buttonText}>Scan Code</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fc", // Soft gray-blue for a modern look
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  permissionButton: {
    backgroundColor: "#28a745", // Green for permission
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 12,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  notificationButton: {
    backgroundColor: "#ffcc00", // Yellow for notifications
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 12,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  scanButton: {
    backgroundColor: "#007AFF", // Blue for scanning
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
