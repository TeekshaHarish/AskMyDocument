# database.py
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,relationship
import datetime

DATABASE_URL = "sqlite:///./pdf_data.db"  # Replace with PostgreSQL URL if needed

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PDFDocument(Base):
    __tablename__ = "pdf_documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    content = Column(String)  # Store extracted text for easier querying
    questions = relationship("Question", back_populates="pdf_document")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, ForeignKey("pdf_documents.id"))
    session_id = Column(String, index=True)  # unique identifier for each document interaction
    question_text = Column(String)
    answer_text = Column(String)
    pdf_document = relationship("PDFDocument", back_populates="questions")

# Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
