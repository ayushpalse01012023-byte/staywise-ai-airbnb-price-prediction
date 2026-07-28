import api from "../services/api";

export async function getPredictionHistory() {
  const response = await api.get("/history");
  return response.data;
}

export async function clearPredictionHistory() {
  const response = await api.delete("/history");
  return response.data;
}