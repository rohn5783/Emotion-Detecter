import { api } from "./api";

export async function logMood({ mood, source = "manual", note = "" }) {
  const response = await api.post("/api/mood/log", { mood, source, note });
  return response.data;
}

export async function getMoodLogs({ range = "30d" } = {}) {
  const response = await api.get(`/api/mood/logs?range=${encodeURIComponent(range)}`);
  return response.data;
}

export async function getMoodAnalytics() {
  const response = await api.get("/api/mood/analytics");
  return response.data;
}

