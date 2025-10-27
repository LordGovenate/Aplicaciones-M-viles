import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { usePosts } from "../context/PostsProvider";

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { state, deletePost } = usePosts();
  const post = state.postsById[id];

  if (!post) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>No encontrado.</Text>
    </View>;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>{post.title}</Text>
      <Text style={{ color: "#999" }}>
        Autor #{post.userId} • {new Date(post.updatedAt).toLocaleString()}
      </Text>
      <Text style={{ marginTop: 12, lineHeight: 20 }}>{post.body}</Text>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
        <Pressable
          onPress={() => navigation.navigate("Edit", { mode: "edit", id })}
          style={{ backgroundColor: "#3498db", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Editar</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Alert.alert("Eliminar", "¿Seguro?", [
              { text: "Cancelar" },
              { text: "Eliminar", style: "destructive", onPress: () => { deletePost(id); navigation.goBack(); } }
            ]);
          }}
          style={{ backgroundColor: "#e74c3c", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}
