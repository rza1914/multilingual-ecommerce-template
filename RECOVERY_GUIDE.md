# Venv Recovery Guide for Multilingual E-commerce Template

This guide provides both an automated PowerShell script and manual commands to fix a broken Python virtual environment, recreate it, install requirements, and run the FastAPI application.

## Automated Recovery (Recommended)

Run the PowerShell script:

```powershell
# From the project root
.\fix-venv-and-run-uvicorn.ps1
```

## Manual Recovery Steps

If the PowerShell script doesn't work, follow these manual steps:

### 1. Navigate to Backend Directory
```cmd
cd E:\template1\multilingual-ecommerce-template\backend
```

### 2. Find Python Installation
```cmd
# Check if Python is available
python --version
# or
python3 --version
```

If Python is not in PATH, use the full path:
```cmd
"C:\Users\[YourUsername]\AppData\Local\Programs\Python\Python311\python.exe" --version
```

### 3. Remove Broken Virtual Environment
```cmd
rmdir /s /q venv
```

### 4. Create New Virtual Environment
```cmd
python -m venv venv --clear
```

### 5. Activate Virtual Environment
```cmd
venv\Scripts\activate
```

### 6. Upgrade pip
```cmd
python -m pip install --upgrade pip --quiet
```

### 7. Install Requirements
```cmd
pip install -r requirements.txt --quiet
```

### 8. Run the Application with Uvicorn
```cmd
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Exit Codes

- `0`: Success (uvicorn running)
- `1`: Python not found
- `2`: Package installation failed
- `3`: Uvicorn failed to start

## Troubleshooting

### If you get execution policy errors in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### If there are permission issues:
- Run PowerShell as Administrator
- Or run the individual commands manually in Command Prompt

### If port 8000 is already in use:
- Change the port in the uvicorn command: `--port 8001`
- Or find and stop the process using port 8000:
```cmd
netstat -ano | findstr :8000
taskkill /PID [PID] /F
```

## Log Files

The recovery script creates log files:
- `logs\venv-recovery.log` - Main recovery logs (in project root)
- `install-error.log` - Temporary installation error logs (deleted after successful install)

## Application Access

Once uvicorn is running, access the application at:
- API: http://localhost:8000
- Documentation: http://localhost:8000/docs
- Alternative: http://0.0.0.0:8000 (accessible from other devices on the same network)