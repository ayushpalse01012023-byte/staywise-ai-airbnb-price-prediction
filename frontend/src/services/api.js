import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const predictPrice = async (listingData) => {
  const response = await API.post("/predict", listingData);
  return response.data;
};

export default API;