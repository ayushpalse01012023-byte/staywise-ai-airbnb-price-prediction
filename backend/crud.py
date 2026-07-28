"""
StayWise AI - CRUD Operations
=============================

This file contains all database operations (Create, Read, Update, Delete)
for the StayWise AI application.

Keeping database logic here keeps the FastAPI routes clean and follows
professional project architecture.
"""

# ----------------------------------------------------------------------
# 1. IMPORTS
# ----------------------------------------------------------------------
from sqlalchemy.orm import Session
from models import Prediction


# ----------------------------------------------------------------------
# 2. CREATE A NEW PREDICTION
# ----------------------------------------------------------------------
def create_prediction(db: Session, listing, predicted_price):
    """
    Saves a new prediction into the SQLite database.
    """

    prediction = Prediction(
        latitude=listing.latitude,
        longitude=listing.longitude,
        neighbourhood_group=listing.neighbourhood_group,
        neighbourhood=listing.neighbourhood,
        room_type=listing.room_type,
        minimum_nights=listing.minimum_nights,
        number_of_reviews=listing.number_of_reviews,
        reviews_per_month=listing.reviews_per_month,
        calculated_host_listings_count=listing.calculated_host_listings_count,
        availability_365=listing.availability_365,
        review_year=listing.review_year,
        review_month=listing.review_month,
        predicted_price=predicted_price,
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction


# ----------------------------------------------------------------------
# 3. GET ALL PREDICTIONS
# ----------------------------------------------------------------------
def get_predictions(db: Session):
    """
    Returns all predictions ordered from newest to oldest.
    """

    return (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .all()
    )