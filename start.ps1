# Start the FastAPI Backend in a new window
Write-Host "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000"

# Start the Next.js Frontend in a new window
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both servers are starting in separate windows!"
Write-Host "Backend will be at: http://localhost:8000"
Write-Host "Frontend will be at: http://localhost:3000"
