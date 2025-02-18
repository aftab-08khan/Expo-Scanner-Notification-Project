import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";

export default function StudentScreen({ route }) {
  const { data } = route.params;
  const [message, setMessage] = useState("");

  const studentName = "John Doe";
  console.log(data?.stdID);

  const handleSubmit = () => {
    console.log("Submitted message:", message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.studentName}>Student: {data?.pushToken}</Text>
      <TextInput
        style={styles.messageBox}
        placeholder="Enter a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  studentName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  messageBox: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});
