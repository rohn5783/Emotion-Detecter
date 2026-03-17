import { api } from "./api";

export async function logoutUser() {
    const response = await api.get("/api/auth/logout");
    return response.data;
}