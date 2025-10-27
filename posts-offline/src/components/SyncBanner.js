import React from "react";
import { View, Text } from "react-native";
import { usePosts } from "../context/PostsProvider";

export default function SyncBanner() {
  const { state } = usePosts();
  const pend = state.pending.length;

  let text = state.online ? (state.syncing ? "Sincronizando…" : "Sincronizado") : "Sin conexión";
  if (pend > 0 && state.online) text = `Pendientes: ${pend} • En cola`;

  const bg = !state.online ? "#c0392b" : state.syncing ? "#2980b9" : pend > 0 ? "#f39c12" : "#27ae60";

  return (
    <View style={{ padding: 8, backgroundColor: bg }}>
      <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>{text}</Text>
    </View>
  );
}
