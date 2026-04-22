from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import Optional
from dotenv import load_dotenv

# Load variables from .env file in the root directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

from services.parser import extract_text
from services.ai_optimizer import optimize_resume
from services.pdf_generator import generate_pdf

app = FastAPI(title="AI Resume Optimization Engine")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Resume Optimization Engine API"}

@app.post("/api/optimize")
async def optimize(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    country: str = Form(...),
    mode: str = Form(...),
    extra_input: Optional[str] = Form(None)
):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    
    # Save the file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as f:
        f.write(await file.read())
    
    try:
        # Extract text
        resume_text = extract_text(temp_file_path)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the provided file.")

        # In a real system, you might fetch country rules from a database. 
        # Here we mock it or pass a predefined set based on the prompt.
        country_rules = {"selected": country, "rules_applied": True}

        # Optimize using AI
        optimized_json = optimize_resume(
            resume_text=resume_text,
            job_description=job_description,
            country=country,
            country_rules=country_rules,
            mode=mode,
            extra_input=extra_input
        )
        
        return {"success": True, "data": optimized_json}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error during optimization: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

class GeneratePdfRequest(BaseModel):
    resume_data: dict

@app.post("/api/generate-pdf")
async def create_pdf(request: GeneratePdfRequest):
    try:
        # Generate PDF using HTML template
        pdf_bytes = generate_pdf(request.resume_data)
        import base64
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        return {"success": True, "pdf_base64": pdf_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
