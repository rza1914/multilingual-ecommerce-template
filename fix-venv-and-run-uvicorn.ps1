# Recovery PowerShell script to fix broken Python venv, recreate it, install requirements, and run uvicorn
# Created on: Sunday, November 16, 2025
# Project: E:\template1\multilingual-ecommerce-template
# Backend: E:\template1\multilingual-ecommerce-template\backend

# CoT Step 1: CET + Root + Backend Dir
# Using UTC time to avoid timezone issues on different systems
$LogTime = { param($msg) "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') UTC] $msg" }
$LogFile = "logs\venv-recovery.log"

# Create logs directory if it doesn't exist in the project root
if (-not (Test-Path "logs")) { 
    New-Item -ItemType Directory -Path "logs" -Force | Out-Null 
}

function Write-Log { 
    param($msg, $level="INFO")
    $entry = (&$LogTime "${level}: ${msg}")
    Add-Content -Path $LogFile -Value $entry -Encoding UTF8
    Write-Host $entry
}

$ProjectRoot = "E:\template1\multilingual-ecommerce-template"
$BackendDir = "$ProjectRoot\backend"
$Requirements = "$BackendDir\requirements.txt"
$VenvDir = "$BackendDir\venv"

if (-not (Test-Path $BackendDir)) { 
    Write-Log "FATAL: Backend dir not found: $BackendDir" "FATAL"; 
    exit 1 
}

Set-Location $BackendDir
# Ensure logs directory exists in the project root
if (-not (Test-Path "$ProjectRoot\logs")) {
    New-Item -ItemType Directory -Path "$ProjectRoot\logs" -Force | Out-Null
}
# Update log path to be relative to backend directory
$LogFile = "..\logs\venv-recovery.log"
Write-Log "INIT: venv recovery started in $BackendDir" "INFO"

# CoT Step 2: Detect Python
$PythonExe = $null
$PythonPaths = @(
    "python", 
    "python3", 
    "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe", 
    "C:\Python311\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe", 
    "C:\Python312\python.exe"
)

foreach ($path in $PythonPaths) {
    if (Get-Command $path -ErrorAction SilentlyContinue) { 
        $PythonExe = $path; 
        break 
    }
}

if (-not $PythonExe) { 
    Write-Log "FATAL: Python not found. Install Python 3.11+ from python.org" "FATAL"; 
    exit 1 
}

$pyVersion = & $PythonExe --version 2>&1
Write-Log "PYTHON: $PythonExe ($pyVersion)" "INFO"

# CoT Step 3: Delete Broken venv (if exists)
if (Test-Path $VenvDir) {
    Write-Log "CLEAN: Removing existing venv directory..." "WARN"
    Remove-Item $VenvDir -Recurse -Force
    Write-Log "CLEAN: Deleted broken venv" "WARN"
}

# CoT Step 4: Create New venv
Write-Log "CREATING: New venv in $VenvDir..." "INFO"
try {
    & $PythonExe -m venv $VenvDir --clear | Out-Null
    if (-not (Test-Path "$VenvDir\pyvenv.cfg")) { 
        throw "pyvenv.cfg missing after creation" 
    }
    Write-Log "VENV_CREATED: pyvenv.cfg confirmed" "INFO"
} catch {
    Write-Log "FATAL_VENV: $($_.Exception.Message)" "FATAL"; 
    exit 1
}

# CoT Step 5: Activate + Install requirements
$VenvPython = "$VenvDir\Scripts\python.exe"
$VenvPip = "$VenvDir\Scripts\pip.exe"

# Wait for pip to be available
Start-Sleep -Seconds 1

# Upgrade pip
Write-Log "UPGRADE: Upgrading pip..." "INFO"
& $VenvPip install --upgrade pip --quiet --disable-pip-version-check

if (-not (Test-Path $Requirements)) { 
    Write-Log "FATAL: requirements.txt not found: $Requirements" "FATAL"; 
    exit 1 
}

Write-Log "INSTALL: Installing packages from requirements.txt" "INFO"
$installProcess = Start-Process -FilePath $VenvPip -ArgumentList "install", "-r", $Requirements, "--quiet", "--disable-pip-version-check" -Wait -PassThru -NoNewWindow -RedirectStandardError "install-error.log"
$installExitCode = $installProcess.ExitCode

if ($installExitCode -ne 0) {
    Write-Log "INSTALL_FAILED: pip exit code $installExitCode" "FATAL"
    if (Test-Path "install-error.log") {
        $errorContent = Get-Content "install-error.log" -Raw
        Write-Log "INSTALL_ERROR_DETAIL: $errorContent" "ERROR"
        Remove-Item "install-error.log" -Force
    }
    exit 2
}

# Clean up error log if it exists and install was successful
if (Test-Path "install-error.log") {
    Remove-Item "install-error.log" -Force
}

Write-Log "INSTALL_SUCCESS: All packages installed" "INFO"

# CoT Step 6: Run uvicorn
Write-Log "STARTING: uvicorn app.main:app --reload" "INFO"

# Check if uvicorn is available in the venv
$uvicornPath = "$VenvDir\Scripts\uvicorn.exe"
if (-not (Test-Path $uvicornPath)) {
    Write-Log "FATAL: uvicorn not found in venv. Attempting to install..." "ERROR"
    $uvicornInstall = Start-Process -FilePath $VenvPip -ArgumentList "install", "uvicorn[standard]", "--quiet", "--disable-pip-version-check" -Wait -PassThru -NoNewWindow
    if ($uvicornInstall.ExitCode -ne 0) {
        Write-Log "UVICORN_INSTALL_FAIL: Could not install uvicorn. Exit code: $($uvicornInstall.ExitCode)" "FATAL"
        exit 3
    }
    Write-Log "UVICORN_INSTALLED: Successfully installed uvicorn in venv" "INFO"
}

try {
    # Run uvicorn with host and port options
    $uvicornProcess = Start-Process -FilePath "$VenvDir\Scripts\uvicorn.exe" -ArgumentList "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info" -PassThru -NoNewWindow
    Write-Log "UVICORN_RUNNING: PID $($uvicornProcess.Id) at http://0.0.0.0:8000" "INFO"
    Write-Log "PRESS Ctrl+C to stop. Logs in $LogFile" "INFO"
    
    # Keep script alive and monitor the process
    while (-not $uvicornProcess.HasExited) { 
        Start-Sleep -Seconds 1 
        # Check if process is still running
        if ($uvicornProcess.HasExited) {
            Write-Log "UVICORN_EXITED: Process exited with code $($uvicornProcess.ExitCode)" "INFO"
            if ($uvicornProcess.ExitCode -ne 0) { 
                Write-Log "UVICORN_ERROR: Process exited with error code $($uvicornProcess.ExitCode)" "ERROR"
                exit 3 
            }
            break
        }
    }
    
    $exitCode = $uvicornProcess.ExitCode
    if ($exitCode -ne 0) { 
        Write-Log "UVICORN_EXIT: $exitCode" "ERROR"
        exit 3 
    }
} catch {
    Write-Log "UVICORN_FAIL: $($_.Exception.Message)" "FATAL"
    exit 3
}

Write-Log "SUCCESS: Backend running cleanly." "INFO"
exit 0