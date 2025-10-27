// API pública: JSONPlaceholder
const BASE = "https://jsonplaceholder.typicode.com";

// GET paginado
export async function apiFetchPosts(page = 1, limit = 20) {
  const res = await fetch(`${BASE}/posts?_page=${page}&_limit=${limit}`);
  if (!res.ok) throw new Error("Error al cargar posts");
  const data = await res.json();
  // Enriquecemos con campos que la API no trae
  return data.map(p => ({
    ...p,
    summary: p.body?.slice(0, 90) ?? "",
    updatedAt: new Date().toISOString() // la API no trae; usamos ahora
  }));
}

export async function apiFetchPost(id) {
  const res = await fetch(`${BASE}/posts/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar el post");
  const p = await res.json();
  return {
    ...p,
    summary: p.body?.slice(0, 90) ?? "",
    updatedAt: new Date().toISOString()
  };
}

// Las mutaciones “funcionan” en JSONPlaceholder, pero no persisten.
// Para el ejercicio nos sirven para simular éxito.
export async function apiCreatePost(post) {
  const res = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error("Error al crear");
  const data = await res.json();
  return { ...post, id: data.id ?? post.id };
}

export async function apiUpdatePost(id, patch) {
  const res = await fetch(`${BASE}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error("Error al actualizar");
  return { id, ...patch };
}

export async function apiDeletePost(id) {
  const res = await fetch(`${BASE}/posts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar");
  return true;
}
