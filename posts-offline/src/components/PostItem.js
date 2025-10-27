import React from "react";
import { Pressable, Text, View } from "react-native";

export default function PostItem({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {item._optimistic ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#f39c12" }} /> : null}
        <Text style={{ fontWeight: "700" }}>{item.title}</Text>
      </View>
      <Text style={{ color: "#666", marginTop: 6 }}>{item.summary}</Text>
      <Text style={{ color: "#999", fontSize: 12, marginTop: 6 }}>
        Autor #{item.userId} • {new Date(item.updatedAt).toLocaleString()}
      </Text>
    </Pressable>
  );
}
