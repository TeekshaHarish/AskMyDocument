# main.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from database import  PDFDocument, Question
import fitz  # PyMuPDF for handling PDFs

# Function to retrieve the stored PDF text from the database
def get_pdf_content(db: Session, doc_id: int) -> str:
    pdf_doc = db.query(PDFDocument).filter(PDFDocument.id == doc_id).first()
    if not pdf_doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return pdf_doc.content

def get_previous_context(db: Session, doc_id: int, session_id: str) -> str:
    """Retrieve previous Q&A pairs as context for linked questions."""
    questions = db.query(Question).filter(
        Question.doc_id == doc_id, Question.session_id == session_id
    ).all()
    context = ""
    for q in questions:
        context += f"Q: {q.question_text}\nA: {q.answer_text}\n"
    return context

# Function to extract text from PDF using PyMuPDF
def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with fitz.open(file_path) as pdf:  # Open the PDF file
        for page_num in range(pdf.page_count):  # Iterate over all pages
            page = pdf.load_page(page_num)  # Load each page
            text += page.get_text("text")  # Extract text from the page
    return text

