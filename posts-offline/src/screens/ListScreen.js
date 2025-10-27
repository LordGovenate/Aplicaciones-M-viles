import React, { useMemo, useRef, useState } from "react";
import { View, FlatList, RefreshControl, Text, Pressable } from "react-native";
import { usePosts } from "../context/PostsProvider";
import PostItem from "../components/PostItem";
import SearchBar from "../components/SearchBar";
import SyncBanner from "../components/SyncBanner";

export default function ListScreen({ navigation }) {
  const { state, loadMore, refresh } = usePosts();
  const [query, setQuery] = useState("");
  const pageRef = useRef(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = state.order.map(id => state.postsById[id]).filter(Boolean);
    if (!q) return arr;
    return arr.filter(p => (p.title?.toLowerCase().includes(q) || (`Autor #${p.userId}`).toLowerCase().includes(q)));
  }, [state.order, state.postsById, query]);

  async function onEndReached() {
    if (loadingMore) return;
    setLoadingMore(true);
    pageRef.current += 1;
    try {
      await loadMore(pageRef.current);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <SyncBanner />
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostItem item={item} onPress={() => navigation.navigate("Detail", { id: item.id })} />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={onEndReached}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#777" }}>
            No hay posts (aún).
          </Text>
        }
      />

      <Pressable
        onPress={() => navigation.navigate("Edit", { mode: "create" })}
        style={{
          position: "absolute", right: 16, bottom: 24,
          backgroundColor: "#2ecc71", paddingVertical: 14, paddingHorizontal: 18,
          borderRadius: 28, elevation: 2
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>＋ Nuevo</Text>
      </Pressable>
    </View>
  );
}
