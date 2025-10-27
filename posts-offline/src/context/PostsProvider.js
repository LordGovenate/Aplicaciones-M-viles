import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { loadStore, saveStore } from "../lib/storage";
import { apiFetchPosts, apiCreatePost, apiUpdatePost, apiDeletePost } from "../lib/api";
import { uuid, nowIso } from "../utils";

const PostsCtx = createContext();

const initial = { postsById: {}, order: [], pending: [], syncing: false, online: true, lastSync: null };

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, ...action.payload };
    case "SET_ONLINE":
      return { ...state, online: action.online };
    case "SET_SYNCING":
      return { ...state, syncing: action.syncing };
    case "UPSERT_POST": {
      const post = action.post;
      const postsById = { ...state.postsById, [post.id]: post };
      const order = state.order.includes(post.id) ? state.order : [post.id, ...state.order];
      return { ...state, postsById, order };
    }
    case "REMOVE_POST": {
      const { [action.id]: _, ...rest } = state.postsById;
      const order = state.order.filter(i => i !== action.id);
      return { ...state, postsById: rest, order };
    }
    case "QUEUE": {
      return { ...state, pending: [...state.pending, action.job] };
    }
    case "DEQUEUE": {
      const pending = state.pending.filter(j => j.id !== action.id);
      return { ...state, pending };
    }
    case "BULK_UPSERT": {
      const postsById = { ...state.postsById };
      const order = [...state.order];
      action.posts.forEach(p => {
        postsById[p.id] = postsById[p.id] && postsById[p.id].updatedAt
          ? lww(postsById[p.id], p) : p;
        if (!order.includes(p.id)) order.push(p.id);
      });
      return { ...state, postsById, order };
    }
    case "SET_LAST_SYNC":
      return { ...state, lastSync: action.ts };
    default:
      return state;
  }
}

// Last-Write-Wins por updatedAt
function lww(local, incoming) {
  if (!local) return incoming;
  const l = new Date(local.updatedAt || 0).getTime();
  const r = new Date(incoming.updatedAt || 0).getTime();
  return r >= l ? incoming : local;
}

export function PostsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const syncingRef = useRef(false);

  // Cargar caché al arrancar
  useEffect(() => {
    (async () => {
      const cached = await loadStore();
      dispatch({ type: "LOAD", payload: { ...initial, ...cached } });
    })();
  }, []);

  // Observar conectividad
  useEffect(() => {
    const unsub = NetInfo.addEventListener(s => {
      dispatch({ type: "SET_ONLINE", online: s.isConnected && s.isInternetReachable !== false });
    });
    return () => unsub();
  }, []);

  // Persistir cada cambio
  useEffect(() => {
    saveStore({ postsById: state.postsById, order: state.order, pending: state.pending, lastSync: state.lastSync });
  }, [state.postsById, state.order, state.pending, state.lastSync]);

  // Sincronizar cuando haya internet o haya cola
  useEffect(() => {
    if (state.online) processQueueAndPull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.online, state.pending.length]);

  async function processQueueAndPull() {
    if (syncingRef.current) return;
    syncingRef.current = true;
    dispatch({ type: "SET_SYNCING", syncing: true });

    // 1) Subir cola (optimista ya aplicado)
    for (const job of state.pending) {
      try {
        if (job.kind === "create") {
          const created = await apiCreatePost(job.post);
          // Resolver ID temporal -> definitivo si cambia
          if (created.id !== job.post.id) {
            // reemplazar ids en store
            dispatch({ type: "REMOVE_POST", id: job.post.id });
            dispatch({ type: "UPSERT_POST", post: { ...created, updatedAt: nowIso() } });
          } else {
            dispatch({ type: "UPSERT_POST", post: { ...created, updatedAt: nowIso() } });
          }
        }
        if (job.kind === "update") {
          const updated = await apiUpdatePost(job.id, job.patch);
          dispatch({ type: "UPSERT_POST", post: { ...state.postsById[job.id], ...updated, updatedAt: nowIso() } });
        }
        if (job.kind === "delete") {
          await apiDeletePost(job.id);
          // ya lo quitamos optimistamente
        }
        dispatch({ type: "DEQUEUE", id: job.id });
      } catch (e) {
        // Mantener en cola, salimos
        break;
      }
    }

    // 2) Pull incremental (página 1 por simplicidad + paginado en UI)
    try {
      const page1 = await apiFetchPosts(1, 20);
      dispatch({ type: "BULK_UPSERT", posts: page1 });
      dispatch({ type: "SET_LAST_SYNC", ts: nowIso() });
    } catch (e) {
      // ignoramos: trabajamos con caché
    }

    dispatch({ type: "SET_SYNCING", syncing: false });
    syncingRef.current = false;
  }

  // API pública del contexto (CRUD + carga paginada + filtro)
  const actions = useMemo(() => ({
    // Página adicional desde servidor (si hay internet) o simulada desde cache
    loadMore: async (page) => {
      if (!state.online) return { ok: true }; // sin internet, nos quedamos con cache
      const incoming = await apiFetchPosts(page, 20);
      dispatch({ type: "BULK_UPSERT", posts: incoming });
      dispatch({ type: "SET_LAST_SYNC", ts: nowIso() });
      return { ok: true };
    },

    refresh: async () => {
      await processQueueAndPull();
    },

    createPost: async ({ title, body, userId = 1 }) => {
      const tempId = uuid();
      const newPost = {
        id: tempId,
        userId,
        title,
        body,
        summary: body.slice(0, 90),
        updatedAt: nowIso(),
        _optimistic: true
      };
      // Optimista
      dispatch({ type: "UPSERT_POST", post: newPost });
      dispatch({ type: "QUEUE", job: { id: uuid(), kind: "create", post: newPost } });
    },

    updatePost: async (id, patch) => {
      const prev = state.postsById[id];
      const updated = { ...prev, ...patch, summary: (patch.body ?? prev.body).slice(0, 90), updatedAt: nowIso(), _optimistic: true };
      // Optimista
      dispatch({ type: "UPSERT_POST", post: updated });
      dispatch({ type: "QUEUE", job: { id: uuid(), kind: "update", patch: updated, post: updated, postId: id, idRef: id, id: uuid(), idDuplicate: undefined } }); // ensure unique id
      // Nota: dejamos job.post/patch con datos completos y job.id único
    },

    deletePost: async (id) => {
      // Optimista
      dispatch({ type: "REMOVE_POST", id });
      dispatch({ type: "QUEUE", job: { id: uuid(), kind: "delete", idRef: id, idTarget: id } });
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state.postsById, state.online]);

  return (
    <PostsCtx.Provider value={{ state, dispatch, ...actions }}>
      {children}
    </PostsCtx.Provider>
  );
}

export const usePosts = () => useContext(PostsCtx);
