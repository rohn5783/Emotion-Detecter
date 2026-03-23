import { api } from "./api";

export async function getChatBootstrap() {
  const response = await api.get("/api/chat/bootstrap");
  return response.data;
}

export async function getDirectMessages(userId, limit = 80) {
  const response = await api.get(
    `/api/chat/dm/${encodeURIComponent(userId)}?limit=${encodeURIComponent(limit)}`
  );
  return response.data;
}
