from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

from database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    neighbourhood_group = Column(String, nullable=False)
    neighbourhood = Column(String, nullable=False)
    room_type = Column(String, nullable=False)

    # Listing Features
    minimum_nights = Column(Integer, nullable=False)
    number_of_reviews = Column(Integer, nullable=False)
    reviews_per_month = Column(Float, nullable=False)

    calculated_host_listings_count = Column(Integer, nullable=False)
    availability_365 = Column(Integer, nullable=False)

    # Review Information
    review_year = Column(Integer, nullable=False)
    review_month = Column(Integer, nullable=False)

    # Model Output
    predicted_price = Column(Float, nullable=False)

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow)