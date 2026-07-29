import api from "../services/api";

export async function getPredictionHistory() {
  const response = await api.get("/history");
  return response.data;
}

export async function clearPredictionHistory() {
  const response = await api.delete("/history");
  return response.data;
}

// ----------------------------------------------------
// Search + Filter + Sort History
// ----------------------------------------------------
export async function searchPredictionHistory({
  search = "",
  room_type = "",
  sort = "newest",
}) {
  const response = await api.get("/history/search", {
    params: {
      search,
      room_type,
      sort,
    },
  });

  return response.data;
}