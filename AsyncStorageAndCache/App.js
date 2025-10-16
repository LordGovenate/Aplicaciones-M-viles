import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,solana&vs_currencies=usd&include_24hr_change=true";
const CACHE_KEY = "crypto_cache_simple";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json));
      setData(json);
    } catch (e) {
      setError("Sin conexión. Mostrando datos guardados.");
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (cache) setData(JSON.parse(cache));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const coins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
    { id: "solana", name: "Solana", symbol: "SOL" },
  ];

  const renderItem = ({ item }) => {
    const info = data?.[item.id];
    if (!info) return null;
    const price = info.usd.toLocaleString("en-US", { maximumFractionDigits: 2 });
    const change = info.usd_24h_change.toFixed(2);
    const up = change >= 0;

    return (
      <View style={styles.card}>
        <Text style={styles.name}>
          {item.name} ({item.symbol})
        </Text>
        <Text style={styles.price}>${price} USD</Text>
        <Text style={[styles.change, up ? styles.up : styles.down]}>
          {up ? "▲" : "▼"} {change}%
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Cache</Text>

      {loading && <ActivityIndicator size="large" color="#2563eb" />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {data && <FlatList data={coins} renderItem={renderItem} keyExtractor={(i) => i.id} />}

      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220", padding: 20, paddingTop: 50 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: "#1f2a44",
    borderWidth: 1,
  },
  name: { color: "white", fontSize: 18, fontWeight: "600" },
  price: { color: "white", fontSize: 16, marginTop: 4 },
  change: { marginTop: 6, fontWeight: "700" },
  up: { color: "#16a34a" },
  down: { color: "#ef4444" },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  error: { color: "#fca5a5", textAlign: "center", marginVertical: 10 },
});
