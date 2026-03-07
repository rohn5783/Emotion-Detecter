import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function logoutUser() {
    const response = await api.get("/api/auth/logout");
    return response.data;
}