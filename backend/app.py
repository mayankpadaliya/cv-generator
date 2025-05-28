from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import os
from datetime import datetime
from cv_enhancer import process_cv, process_pdf_cv
from dotenv import load_dotenv
import PyPDF2

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a directory for storing CV data if it doesn't exist
CV_DATA_DIR = 'cv_data'
if not os.path.exists(CV_DATA_DIR):
    os.makedirs(CV_DATA_DIR)

# Pydantic model for CV data validation
class CVData(BaseModel):
    data: Dict

# Pydantic model for PDF generation request
class PDFGenerationRequest(BaseModel):
    cv_file_name: str

@app.post("/api/cv")
async def save_cv(cv_data: CVData):
    try:
        # Generate a unique filename using timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'cv_{timestamp}.json'
        file_path = os.path.join(CV_DATA_DIR, filename)
        
        # Save the CV data to a JSON file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(cv_data.data, f, indent=2)
        
        return JSONResponse(
            content={
                'message': 'CV data saved successfully',
                'filename': filename
            },
            status_code=201
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cv")
async def get_all_cvs():
    try:
        cv_files = []
        for filename in os.listdir(CV_DATA_DIR):
            if filename.endswith('.json'):
                file_path = os.path.join(CV_DATA_DIR, filename)
                with open(file_path, 'r', encoding='utf-8') as f:
                    cv_data = json.load(f)
                    cv_files.append({
                        'filename': filename,
                        'data': cv_data
                    })
        
        return cv_files
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cv/{filename}")
async def get_cv(filename: str):
    try:
        file_path = os.path.join(CV_DATA_DIR, filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail='CV not found')
            
        with open(file_path, 'r', encoding='utf-8') as f:
            cv_data = json.load(f)
            
        return cv_data
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-pdf")
async def generate_pdf(request: PDFGenerationRequest):
    try:
        # Get OpenAI API key from environment variable
        api_key = os.getenv("OPENAI_API_KEY")
        print(f"API Key present: {bool(api_key)}")  # Debug log
        
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not found")

        # Process the CV
        cv_json_path = os.path.join(CV_DATA_DIR, request.cv_file_name)
        print(f"Looking for CV file at: {cv_json_path}")  # Debug log
        
        if not os.path.exists(cv_json_path):
            raise HTTPException(status_code=404, detail="CV file not found")

        print("Starting CV processing...")  # Debug log
        pdf_path, error = process_cv(cv_json_path, api_key)
        print(f"CV processing result - PDF path: {pdf_path}, Error: {error}")  # Debug log
        
        if error:
            raise HTTPException(status_code=500, detail=f"Processing error: {error}")
            
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="PDF generation failed - file not created")
            
        # Return the PDF file
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=os.path.basename(pdf_path)
        )

    except Exception as e:
        print(f"Error in generate_pdf: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        print(f"[DEBUG] Starting PDF upload process for file: {file.filename}")
        
        # Check if file is PDF
        if not file.filename.endswith('.pdf'):
            print(f"[ERROR] Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="File must be a PDF")
            
        # Create uploads directory if it doesn't exist
        UPLOAD_DIR = 'uploads'
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
            print(f"[DEBUG] Created uploads directory: {UPLOAD_DIR}")
            
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        print(f"[DEBUG] Saving file to: {file_path}")
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        print(f"[DEBUG] File saved successfully, size: {len(content)} bytes")
            
        # Extract text from PDF
        try:
            print("[DEBUG] Starting PDF text extraction")
            with open(file_path, 'rb') as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                print(f"[DEBUG] PDF has {len(reader.pages)} pages")
                text = ""
                for i, page in enumerate(reader.pages):
                    extracted_text = page.extract_text()
                    print(f"[DEBUG] Page {i+1} extracted text length: {len(extracted_text) if extracted_text else 0}")
                    if extracted_text:
                        text += extracted_text + "\n"
            
            final_text_length = len(text.strip())
            print(f"[DEBUG] Total extracted text length: {final_text_length}")
            
            if not text.strip():
                print("[ERROR] No text could be extracted from the PDF")
                raise HTTPException(status_code=400, detail="Could not extract text from PDF. The file might be scanned or protected.")
            
            # Initialize empty sections structure
            sections = {
                "personalInfo": {
                    "firstName": "",
                    "lastName": "",
                    "email": "",
                    "phone": "",
                    "location": "",
                },
                "education": [],
                "experience": [],
                "skills": [],
                "certifications": []
            }
            
            print("[DEBUG] Preparing response with extracted text")
            # Return both raw text and structured sections
            return JSONResponse(content={
                "rawText": text,
                "sections": sections
            })
            
        except Exception as e:
            print(f"[ERROR] PDF processing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
        finally:
            # Clean up the uploaded file
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"[DEBUG] Cleaned up temporary file: {file_path}")
            
    except Exception as e:
        print(f"[ERROR] Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/test-pdf-parse")
async def test_pdf_parse(file: UploadFile = File(...)):
    try:
        print("[TEST] Starting PDF parse test...")
        
        # Check if file is PDF
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Create test directory if it doesn't exist
        test_dir = 'test_uploads'
        if not os.path.exists(test_dir):
            os.makedirs(test_dir)
        
        # Save the uploaded file
        file_path = os.path.join(test_dir, file.filename)
        print(f"[TEST] Saving file to: {file_path}")
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Test PDF parsing
        try:
            print("[TEST] Testing PDF parsing...")
            with open(file_path, 'rb') as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                print(f"[TEST] PDF Info:")
                print(f"[TEST] - Number of pages: {len(reader.pages)}")
                print(f"[TEST] - Is Encrypted: {reader.is_encrypted}")
                
                # Try to extract text from each page
                all_text = ""
                for i, page in enumerate(reader.pages):
                    try:
                        page_text = page.extract_text()
                        text_length = len(page_text) if page_text else 0
                        print(f"[TEST] - Page {i+1} text length: {text_length}")
                        if page_text:
                            all_text += page_text + "\n"
                    except Exception as page_error:
                        print(f"[TEST] Error extracting text from page {i+1}: {str(page_error)}")
                
                total_length = len(all_text.strip())
                print(f"[TEST] Total extracted text length: {total_length}")
                
                # Return detailed test results
                return JSONResponse(content={
                    "success": total_length > 0,
                    "details": {
                        "total_pages": len(reader.pages),
                        "is_encrypted": reader.is_encrypted,
                        "total_text_length": total_length,
                        "sample_text": all_text[:500] if all_text else None,
                        "has_text": total_length > 0
                    }
                })
                
        except Exception as e:
            print(f"[TEST] PDF parsing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"PDF parsing error: {str(e)}")
        finally:
            # Clean up test file
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"[TEST] Cleaned up test file: {file_path}")
    
    except Exception as e:
        print(f"[TEST] Test error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True) 