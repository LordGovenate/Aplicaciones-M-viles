import React, { useState } from "react";
import { View, TextInput, Text, Pressable, Alert } from "react-native";
import { usePosts } from "../context/PostsProvider";

export default function EditScreen({ route, navigation }) {
  const { mode, id } = route.params ?? { mode: "create" };
  const { state, createPost, updatePost } = usePosts();

  const existing = mode === "edit" ? state.postsById[id] : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");

  const isValid = title.trim().length > 0 && body.trim().length > 0;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{mode === "edit" ? "Editar post" : "Nuevo post"}</Text>
      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
      />
      <TextInput
        placeholder="Contenido"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={6}
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, textAlignVertical: "top" }}
      />

      <Pressable
        disabled={!isValid}
        onPress={async () => {
          if (!isValid) {
            Alert.alert("Completa título y contenido");
            return;
          }
          if (mode === "edit") {
            await updatePost(existing.id, { title, body });
            navigation.goBack();
          } else {
            await createPost({ title, body, userId: 1 });
            navigation.goBack();
          }
        }}
        style={{
          backgroundColor: isValid ? "#27ae60" : "#95a5a6",
          padding: 14, borderRadius: 8, alignItems: "center"
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>{mode === "edit" ? "Guardar cambios" : "Crear"}</Text>
      </Pressable>
    </View>
  );
}
