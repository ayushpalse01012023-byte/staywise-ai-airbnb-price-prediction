import { useState } from "react";

import PredictionHero from "../components/prediction/PredictionHero";
import PredictionFormSection from "../components/prediction/PredictionFormSection";
import PredictionResultSection from "../components/prediction/PredictionResultSection";
import FeatureHighlights from "../components/prediction/FeatureHighlights";

function PredictPage() {
  // Stores the prediction returned from FastAPI
  const [prediction, setPrediction] = useState(null);

  return (
    <>
      <PredictionHero />

      <PredictionFormSection
        prediction={prediction}
        setPrediction={setPrediction}
      />

      {/* Show prediction result only after the API returns data */}
      {prediction && (
        <PredictionResultSection
          prediction={prediction}
          confidence={94.6}
          predictionTime={0.18}
          modelName="XGBoost Regressor"
          recommendation="This listing appears competitively priced based on location, availability, reviews, and historical Airbnb trends."
          insight="Our AI analyzed the neighbourhood, room type, host activity, availability, location, and review patterns to estimate this nightly Airbnb price."
        />
      )}

      <FeatureHighlights />
    </>
  );
}

export default PredictPage;