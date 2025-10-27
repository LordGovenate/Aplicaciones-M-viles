import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "POSTS_STORE_V1";

export async function loadStore() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return { postsById: {}, order: [], pending: [], lastSync: null };
  try {
    return JSON.parse(raw);
  } catch {
    return { postsById: {}, order: [], pending: [], lastSync: null };
  }
}

export async function saveStore(store) {
  await AsyncStorage.setItem(KEY, JSON.stringify(store));
}
