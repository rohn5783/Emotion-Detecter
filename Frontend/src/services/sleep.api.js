import { api } from "./api";

export async function saveSleep({ date, hours, quality = "Good", notes = "" }) {
  const response = await api.put("/api/sleep", { date, hours, quality, notes });
  return response.data;
}

export async function listSleep() {
  const response = await api.get("/api/sleep");
  return response.data;
}

