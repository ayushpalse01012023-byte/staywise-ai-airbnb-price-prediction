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

def delete_all_predictions(db):
    db.query(Prediction).delete()
    db.commit()

# ----------------------------------------------------------------------
# DASHBOARD ANALYTICS
# ----------------------------------------------------------------------
from sqlalchemy import func


def get_dashboard_statistics(db: Session):
    """
    Returns all dashboard statistics required by the frontend.
    """

    total_predictions = db.query(Prediction).count()

    average_price = (
        db.query(func.avg(Prediction.predicted_price))
        .scalar()
    )

    highest_price = (
        db.query(func.max(Prediction.predicted_price))
        .scalar()
    )

    lowest_price = (
        db.query(func.min(Prediction.predicted_price))
        .scalar()
    )

    recent_predictions = (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .limit(5)
        .all()
    )

    room_type_distribution = (
        db.query(
            Prediction.room_type,
            func.count(Prediction.id)
        )
        .group_by(Prediction.room_type)
        .all()
    )

    return {
        "total_predictions": total_predictions,
        "average_price": round(float(average_price), 2) if average_price else 0,
        "highest_price": round(float(highest_price), 2) if highest_price else 0,
        "lowest_price": round(float(lowest_price), 2) if lowest_price else 0,
        "recent_predictions": recent_predictions,
        "room_type_distribution": {
            room_type: count
            for room_type, count in room_type_distribution
        },
    }