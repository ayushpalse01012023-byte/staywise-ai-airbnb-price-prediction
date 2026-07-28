"""
StayWise AI - Database Configuration
====================================

This file is responsible for:

1. Creating the SQLite database connection.
2. Creating the SQLAlchemy Engine.
3. Creating database sessions.
4. Providing the Base class for ORM models.
5. Providing a database dependency for FastAPI.

The database file (staywise.db) will always be created inside the
backend folder, regardless of where uvicorn is launched from.
"""

# ----------------------------------------------------------------------
# 1. IMPORTS
# ----------------------------------------------------------------------
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# ----------------------------------------------------------------------
# 2. DATABASE PATH
# ----------------------------------------------------------------------
# Absolute path of the backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Database file inside backend/
DATABASE_PATH = os.path.join(BASE_DIR, "staywise.db")

# SQLite URL
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# ----------------------------------------------------------------------
# 3. DATABASE ENGINE
# ----------------------------------------------------------------------
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# ----------------------------------------------------------------------
# 4. SESSION FACTORY
# ----------------------------------------------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ----------------------------------------------------------------------
# 5. BASE CLASS
# ----------------------------------------------------------------------
Base = declarative_base()

# ----------------------------------------------------------------------
# 6. DATABASE DEPENDENCY
# ----------------------------------------------------------------------
def get_db():
    """
    Creates a new database session for every request
    and closes it automatically after the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()