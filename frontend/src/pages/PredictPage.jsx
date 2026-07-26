import PredictionHero from "../components/prediction/PredictionHero";
import PredictionFormSection from "../components/prediction/PredictionFormSection";
import PredictionResultSection from "../components/prediction/PredictionResultSection";


function PredictPage() {
  return (
    <>
      <PredictionHero />
      <PredictionFormSection />
      <PredictionResultSection
        predictedPrice={109.84}
        confidence={94.6}
        predictionTime={0.18}
        modelName="XGBoost Regressor"
        recommendation="This listing appears competitively priced based on location, availability and historical Airbnb trends."
        insight="Our AI analyzed location, room type, host activity, reviews, and availability to estimate this nightly price."
      />
    </>
  );
}

export default PredictPage;