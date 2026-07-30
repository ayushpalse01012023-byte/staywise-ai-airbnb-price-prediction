import axios from "axios";

const API = axios.create({
  baseURL: "https://staywise-ai-backend-b0th.onrender.com",
});

export const predictPrice = async (listingData) => {
  const response = await API.post("/predict", listingData);
  return response.data;
};

export default API;