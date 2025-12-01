# start_frontend.ps1
# Script to start the frontend development server for the multilingual e-commerce template

Write-Host "Starting frontend development server..." -ForegroundColor Green
Write-Host "Project: Multilingual E-Commerce Template" -ForegroundColor Cyan

# Change to the frontend directory
Set-Location $PSScriptRoot\frontend

# Check if node_modules exists, if not run npm install
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found, running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm install failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "npm install completed successfully." -ForegroundColor Green
}

# Start the Vite development server
Write-Host "Starting Vite development server on http://localhost:5173..." -ForegroundColor Green
npm run dev