import api from "../services/api";

export async function getPredictionHistory() {
  const response = await api.get("/history");
  return response.data;
}