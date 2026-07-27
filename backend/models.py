from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

from database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    neighbourhood_group = Column(String, nullable=False)
    neighbourhood = Column(String, nullable=False)
    room_type = Column(String, nullable=False)

    minimum_nights = Column(Integer, nullable=False)
    number_of_reviews = Column(Integer, nullable=False)
    reviews_per_month = Column(Float, nullable=False)

    calculated_host_listings_count = Column(Integer, nullable=False)
    availability_365 = Column(Integer, nullable=False)

    predicted_price = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)