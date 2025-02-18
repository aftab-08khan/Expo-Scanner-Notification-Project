import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useCameraPermissions, PermissionStatus } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

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

      <Pressable
        onPress={handlePermissionRequest}
        style={styles.permissionButton}
      >
        <Text style={styles.buttonText}>Request Permission</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("ScannerScreen")}
        disabled={!permission?.granted}
        style={[styles.scanButton, { opacity: permission?.granted ? 1 : 0.5 }]}
      >
        <Text style={styles.buttonText}>Scan Code</Text>
      </Pressable>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Changed to a neutral background
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  scanButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
