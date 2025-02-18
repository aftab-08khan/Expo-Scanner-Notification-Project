import { useNavigation } from "@react-navigation/native";
import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Platform,
} from "react-native";

export default function ScannerScreen() {
  const navigation = useNavigation();

  const handleBarcodeScanned = ({ data }) => {
    console.log(data, "scanned data");

    // if (data === "specificStudentID") {
    navigation.navigate("StudentScreen", { studentId: data });
    // } else {
    //   alert("This is not a valid student ID.");
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Scanner Screen</Text>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
