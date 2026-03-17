import { api } from "./api";

export async function createEntry({ title = "", text, mood = "Neutral" }) {
  const response = await api.post("/api/journal", { title, text, mood });
  return response.data;
}

export async function listEntries() {
  const response = await api.get("/api/journal");
  return response.data;
}

export async function deleteEntry(id) {
  const response = await api.delete(`/api/journal/${id}`);
  return response.data;
}

