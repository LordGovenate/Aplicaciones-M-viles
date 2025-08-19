import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, StatusBar } from "react-native";

export default function App() {
  const [couter, setCouter] = useState(0);

  const handleChange = (txt) => {
    const n = parseInt(txt, 10);
    setCouter(Number.isNaN(n) ? 0 : n);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.card}>
        <Text style={styles.title}>Mi contador</Text>

        <TextInput    
          placeholder="Ingrese un número"
          keyboardType="numeric"
          value={String(couter)}
          onChangeText={handleChange}
          placeholderTextColor="#9aa0a6"
          style={styles.input}
        />

        <Text style={styles.value}>Contador: {couter}</Text>

        <View style={styles.btns}>
          <Button title="− 1" color="#374151" onPress={() => setCouter(couter - 1)} />
          <Button title="+ 1" color="#2563eb" onPress={() => setCouter(couter + 1)} />
        </View>

        <Button title="Reiniciar" color="#1f2937" onPress={() => setCouter(0)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    elevation: 6,
  },
  title: {
    color: "#e5e7eb",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#0b1220",
    color: "#e5e7eb",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  value: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
});
