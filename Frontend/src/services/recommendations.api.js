import { api } from "./api";

export async function getRecommendations(mood) {
  const response = await api.get(`/api/recommendations?mood=${encodeURIComponent(mood || "Neutral")}`);
  return response.data;
}

