import { api } from "./api";

export async function register({username,email,password}) {
  const response = await api.post("/api/auth/register",{username,email,password});
  return response.data;
}

export async function login({email,password}) {
  const response = await api.post("/api/auth/login",{email,password});
  return response.data;
}

export async function getAllNotes() {
  const response = await api.get("/api/auth/getAll");
  return response.data;
}

export async function getUser() {
  const response = await api.get("/api/auth/getUser");
  return response.data;
}