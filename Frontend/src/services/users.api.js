import { api } from "./api";

export async function listUsers() {
  const response = await api.get("/api/users");
  return response.data;
}

