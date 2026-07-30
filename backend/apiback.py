"""
StayWise AI - Airbnb Price Prediction Backend
===============================================
FastAPI backend that loads a pre-trained XGBoost Regressor model and serves
price predictions based on raw (non-encoded) Airbnb listing features.

The model was trained on a log-transformed target (y = np.log1p(price)),
so every prediction is converted back to the original price scale using
np.expm1() before being returned to the client.
"""

# ----------------------------------------------------------------------
# 1. IMPORTS
# ----------------------------------------------------------------------
from datetime import datetime
from typing import List

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.orm import Session
from database import engine, get_db
from models import Base
import crud
from typing import Optional
from fastapi import Query

# Create all database tables
Base.metadata.create_all(bind=engine)

# ----------------------------------------------------------------------
# 2. FASTAPI APP INITIALIZATION
# ----------------------------------------------------------------------
app = FastAPI(
    title="StayWise AI - Airbnb Price Prediction API",
    description="Predicts Airbnb listing prices using a trained XGBoost model.",
    version="1.0.0",
)


# ----------------------------------------------------------------------
# 3. CORS CONFIGURATION
# ----------------------------------------------------------------------
# Allows the HTML/CSS/JavaScript frontend (running on any localhost port,
# e.g. Live Server on 127.0.0.1:5500) to call this API without CORS errors.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://staywise-ai.netlify.app",
                      ],       # For development. Restrict to specific domains in production.
    allow_credentials=True,
    allow_methods=["*"],       # Allow GET, POST, etc.
    allow_headers=["*"],       # Allow all headers.
)


# ----------------------------------------------------------------------
# 4. LOAD MODEL AND FEATURE COLUMNS
# ----------------------------------------------------------------------
try:
    model = joblib.load("staywise_model.pkl")
    feature_columns = joblib.load("features_columns.pkl")
except FileNotFoundError as error:
    # If the model files are missing, the app should fail loudly at startup
    # rather than silently breaking every prediction request.
    raise RuntimeError(
        f"Required model file not found: {error}. "
        "Ensure 'staywise_model.pkl' and 'features_columns.pkl' are present "
        "in the working directory."
    )


# ----------------------------------------------------------------------
# 5. REQUEST BODY SCHEMA (Pydantic Model)
# ----------------------------------------------------------------------
class ListingFeatures(BaseModel):
    """
    Raw input fields provided by the frontend/user.
    These are the ORIGINAL (non-encoded) features only.
    One-hot encoding is handled internally by the backend.
    """
    latitude: float = Field(..., description="Latitude of the listing")
    longitude: float = Field(..., description="Longitude of the listing")
    neighbourhood_group: str = Field(..., description="e.g. 'Manhattan'")
    neighbourhood: str = Field(..., description="e.g. 'Midtown'")
    room_type: str = Field(..., description="e.g. 'Private room'")
    minimum_nights: int = Field(..., ge=0, description="Minimum nights required")
    number_of_reviews: int = Field(..., ge=0, description="Total number of reviews")
    reviews_per_month: float = Field(..., ge=0, description="Average reviews per month")
    calculated_host_listings_count: int = Field(..., ge=0, description="Number of listings by host")
    availability_365: int = Field(..., ge=0, le=365, description="Days available in a year")
    review_year: int = Field(..., description="Year of the most recent review")
    review_month: int = Field(..., ge=1, le=12, description="Month of the most recent review")


# ----------------------------------------------------------------------
# 5B. RESPONSE SCHEMA (Pydantic Model)
# ----------------------------------------------------------------------
class PredictionResponse(BaseModel):
    """
    Response schema used to serialize stored prediction records
    (SQLAlchemy ORM objects) returned by the /history endpoint.
    """
    id: int
    latitude: float
    longitude: float
    neighbourhood_group: str
    neighbourhood: str
    room_type: str
    minimum_nights: int
    number_of_reviews: int
    reviews_per_month: float
    calculated_host_listings_count: int
    availability_365: int
    review_year: int
    review_month: int
    predicted_price: float
    created_at: datetime

    # Enables Pydantic to read data directly from ORM model attributes.
    model_config = ConfigDict(from_attributes=True)

class DashboardResponse(BaseModel):
    total_predictions: int
    average_price: float
    highest_price: float
    lowest_price: float
    recent_predictions: List[PredictionResponse]
    room_type_distribution: dict[str, int]

# ----------------------------------------------------------------------
# 6. ROOT ENDPOINT (Health Check)
# ----------------------------------------------------------------------
@app.get("/")
def read_root():
    """Simple health-check endpoint to confirm the API is running."""
    return {"message": "StayWise AI API is running"}


# ----------------------------------------------------------------------
# 7. PREDICTION ENDPOINT
# ----------------------------------------------------------------------
@app.post("/predict")
def predict_price(
    listing: ListingFeatures,
    db: Session = Depends(get_db)
):
    """
    Accepts raw listing features, manually one-hot encodes the categorical
    fields to match the training-time feature set, runs the XGBoost model,
    persists the prediction to the database, and returns the predicted
    price on the original (non-log) scale.
    """
    try:
        # ------------------------------------------------------------
        # STEP 1: Build a single-row DataFrame with ALL feature columns
        # initialized to 0. This guarantees the exact same columns
        # (and order) that the model was trained on.
        # ------------------------------------------------------------
        input_df = pd.DataFrame(
            [[0] * len(feature_columns)],
            columns=feature_columns
        )

        # ------------------------------------------------------------
        # STEP 2: Fill in the numeric (non-categorical) features.
        # These columns are assumed to exist as-is in feature_columns
        # since they were not one-hot encoded during training.
        # ------------------------------------------------------------
        numeric_features = {
            "latitude": listing.latitude,
            "longitude": listing.longitude,
            "minimum_nights": listing.minimum_nights,
            "number_of_reviews": listing.number_of_reviews,
            "reviews_per_month": listing.reviews_per_month,
            "calculated_host_listings_count": listing.calculated_host_listings_count,
            "availability_365": listing.availability_365,
            "review_year": listing.review_year,
            "review_month": listing.review_month,
        }

        for column_name, value in numeric_features.items():
            if column_name in input_df.columns:
                input_df[column_name] = value
            # If a numeric column is missing from feature_columns, it is
            # silently skipped -- this keeps the endpoint robust against
            # minor mismatches between training and inference schemas.

        # ------------------------------------------------------------
        # STEP 3: Manually one-hot encode the categorical features.
        # We build the expected column name (e.g. "neighbourhood_group_Manhattan")
        # and set it to 1 ONLY if that exact column exists in feature_columns.
        # This avoids KeyErrors for categories unseen during training.
        # ------------------------------------------------------------
        categorical_encodings = {
            "neighbourhood_group": listing.neighbourhood_group,
            "neighbourhood": listing.neighbourhood,
            "room_type": listing.room_type,
        }

        for prefix, selected_value in categorical_encodings.items():
            encoded_column_name = f"{prefix}_{selected_value}"
            if encoded_column_name in input_df.columns:
                input_df[encoded_column_name] = 1
            # If the category wasn't seen during training, no column is
            # set -- the row simply stays at the encoded "baseline" for
            # that categorical feature.

        # ------------------------------------------------------------
        # STEP 4: Ensure column order exactly matches feature_columns.
        # (input_df was already created with this column order, but we
        # re-index defensively in case any step altered it.)
        # ------------------------------------------------------------
        input_df = input_df[feature_columns]

        # ------------------------------------------------------------
        # STEP 5: Run the prediction. The model outputs a value on the
        # log1p scale, so we invert it with expm1() to get the real price.
        # ------------------------------------------------------------
        log_prediction = model.predict(input_df)
        predicted_price = np.expm1(log_prediction)[0]

        # Guard against negative or invalid predictions caused by edge cases.
        if predicted_price < 0 or np.isnan(predicted_price):
            raise ValueError("Model produced an invalid price prediction.")

        # ------------------------------------------------------------
        # STEP 6: Persist this prediction to SQLite via the CRUD layer
        # so it can be retrieved later (e.g. for the History page).
        # ------------------------------------------------------------
        crud.create_prediction(
            db=db,
            listing=listing,
            predicted_price=float(predicted_price)
        )

        return {"predicted_price": round(float(predicted_price), 2)}

    except ValueError as ve:
        # Raised for invalid/unusable prediction results.
        raise HTTPException(status_code=422, detail=str(ve))

    except Exception as e:
        # Catch-all for unexpected errors (e.g. shape mismatches, model errors).
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# ----------------------------------------------------------------------
# 8. HISTORY ENDPOINT
# ----------------------------------------------------------------------
@app.get("/history", response_model=List[PredictionResponse])
def get_prediction_history(db: Session = Depends(get_db)):
    """
    Retrieves all previously stored predictions from the database,
    ordered as returned by the CRUD layer, for display on the
    frontend's History page.
    """
    try:
        return crud.get_predictions(db)

    except Exception as e:
        # Catch-all for unexpected errors while reading prediction history.
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

# ----------------------------------------------------------------------
# SEARCH + FILTER HISTORY
# ----------------------------------------------------------------------
@app.get("/history/search", response_model=List[PredictionResponse])
def search_history(
    search: Optional[str] = Query(None),
    room_type: Optional[str] = Query(None),
    sort: str = Query("newest"),
    db: Session = Depends(get_db),
):
    """
    Search, filter and sort prediction history.
    """

    try:
        return crud.search_predictions(
            db=db,
            search=search,
            room_type=room_type,
            sort=sort,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to search history: {str(e)}"
        )

# ----------------------------------------------------------------------
# CLEAR ALL PREDICTION HISTORY
# ----------------------------------------------------------------------
@app.delete("/history")
def clear_prediction_history(db: Session = Depends(get_db)):
    """
    Deletes every prediction stored in the SQLite database.
    """

    crud.delete_all_predictions(db)

    return {
        "message": "Prediction history cleared successfully."
    }

# ----------------------------------------------------------------------
# DASHBOARD ANALYTICS
# ----------------------------------------------------------------------
@app.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """
    Returns analytics used by the dashboard.
    """

    try:
        return crud.get_dashboard_statistics(db)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load dashboard: {str(e)}"
        )