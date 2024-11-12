from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, PDFDocument, Question
import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
from utils import get_pdf_content, get_previous_context,extract_text_from_pdf
from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq

# Load environment variables from .env file
load_dotenv()

# Access the environment variable for the Groq API key
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise HTTPException(status_code=500, detail="GROQ_API_KEY not found in environment variables.")

# Initialize the AI language model using ChatGroq
llm = ChatGroq(
    model="mixtral-8x7b-32768",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params can be added as needed
)

# Initialize FastAPI application
app = FastAPI()

# Define allowed origins for CORS
allowed_origins = [
    "http://localhost:5173"  # Frontend URL for local development
]

# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # List of allowed origins for cross-origin requests
    allow_credentials=True,         # Allow cookies to be sent with requests
    allow_methods=["*"],            # Allow all HTTP methods (e.g., GET, POST)
    allow_headers=["*"],            # Allow all headers
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()  # Initialize a new database session
    try:
        yield db
    finally:
        db.close()  # Ensure the session is closed after use



# Endpoint to upload a PDF file
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...), db=Depends(get_db)):
    # Check if the uploaded file is a PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are allowed.")
    
    # Save the uploaded PDF file locally
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())  # Write the file content to disk

    # Extract text from the PDF file
    extracted_text = extract_text_from_pdf(file_path)

    # Store the PDF metadata (filename, content) in the database
    pdf_doc = PDFDocument(filename=file.filename, content=extracted_text)
    db.add(pdf_doc)  # Add to the session
    db.commit()      # Commit the transaction to save the document
    db.refresh(pdf_doc)  # Refresh to get the latest database record

    # Return the uploaded file's details and extracted text
    return {"filename": file.filename, "content": extracted_text, "id": pdf_doc.id}

# Endpoint to ask a question about the uploaded PDF document
@app.post("/ask-question/")
async def ask_question(doc_id: int = Body(...), question: str = Body(...), session_id: str = Body(None), db: Session = Depends(get_db)):
    # Retrieve the content of the PDF document based on the provided doc_id
    pdf_content = get_pdf_content(db, doc_id)

    # If session_id is not provided, generate a new session ID
    if not session_id:
        session_id = str(uuid.uuid4())

    # Get previous conversation context if available for the given session
    previous_context = get_previous_context(db, doc_id, session_id)

    # Construct the message to be sent to the AI model
    messages = [
        (
            "system",
            f"""
            You are an AI that answers questions based on a document's content. 
            The document content is as follows:
            {pdf_content}
            
            Previous conversation context (if any) is provided below in a Q&A format:
            {previous_context}
            
            User's current question:
            {question}
            
            Please provide a precise and direct answer based on the document content and the previous conversation, if relevant. Do not add any additional information.
            """,
        )
    ]

    # Get the answer from the AI language model
    ai_msg = llm.invoke(messages)

    # Store the question and answer in the database for future reference
    question_record = Question(
        doc_id=doc_id, session_id=session_id, question_text=question, answer_text=ai_msg.content
    )
    db.add(question_record)  # Add to the session
    db.commit()  # Commit the transaction to save the question-answer pair

    # Return the session ID, question, and generated answer
    return {"session_id": session_id, "question": question, "answer": ai_msg.content}
