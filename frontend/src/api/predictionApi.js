import api from "../services/api";

/**
 * Send prediction request to FastAPI
 * @param {Object} predictionData
 * @returns {Promise<Object>}
 */
export const predictPrice = async (predictionData) => {
  try {
    const response = await api.post("/predict", predictionData);
    return response.data;
  } catch (error) {
    console.error("Prediction API Error:", error);

    if (error.response) {
      throw new Error(
        error.response.data?.detail || "Prediction failed."
      );
    }

    if (error.request) {
      throw new Error(
        "Unable to connect to the backend server."
      );
    }

    throw new Error("Something went wrong.");
  }
};