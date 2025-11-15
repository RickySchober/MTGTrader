import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    engine = create_engine(
        DATABASE_URL,
        echo=False,            
    )
else:
    DATABASE_URL = "sqlite:///./cards.db"
    engine = create_engine(
        DATABASE_URL,
        echo=True,              
        connect_args={"check_same_thread": False},
    )

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
