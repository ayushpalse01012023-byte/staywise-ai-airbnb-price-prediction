from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

print("Current Working Directory:", os.getcwd())
print("Database Absolute Path:", os.path.abspath("staywise.db"))

# SQLite database file
DATABASE_URL = "sqlite:///staywise.db"

# Create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()


# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()