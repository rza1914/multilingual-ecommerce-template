@echo off
REM Recovery batch script to fix broken Python venv, recreate it, install requirements, and run uvicorn
REM Created on: Sunday, November 16, 2025
REM Project: E:\template1\multilingual-ecommerce-template
REM Backend: E:\template1\multilingual-ecommerce-template\backend

setlocal enabledelayedexpansion

REM Set variables
set PROJECT_ROOT=E:\template1\multilingual-ecommerce-template
set BACKEND_DIR=%PROJECT_ROOT%\backend
set REQUIREMENTS=%BACKEND_DIR%\requirements.txt
set VENV_DIR=%BACKEND_DIR%\venv
set LOG_FILE=%PROJECT_ROOT%\logs\venv-recovery.log

REM Create logs directory if it doesn't exist
if not exist "%PROJECT_ROOT%\logs" mkdir "%PROJECT_ROOT%\logs"

REM Function to log messages
:log
echo [%date% %time%] %~1
echo [%date% %time%] %~1 >> "%LOG_FILE%"
goto :eof

REM Check if backend directory exists
if not exist "%BACKEND_DIR%" (
    call :log "FATAL: Backend dir not found: %BACKEND_DIR%"
    exit /b 1
)

REM Navigate to backend directory
cd /d "%BACKEND_DIR%"
call :log "INIT: venv recovery started in %BACKEND_DIR%"

REM Detect Python executable
set PYTHON_EXE=
for %%i in (python python3) do (
    where %%i >nul 2>nul && set PYTHON_EXE=%%i && goto :python_found
)

REM Check standard Python installation paths
if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python311\python.exe
    goto :python_found
)
if exist "C:\Python311\python.exe" (
    set PYTHON_EXE=C:\Python311\python.exe
    goto :python_found
)
if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    set PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python312\python.exe
    goto :python_found
)
if exist "C:\Python312\python.exe" (
    set PYTHON_EXE=C:\Python312\python.exe
    goto :python_found
)

:python_found
if not defined PYTHON_EXE (
    call :log "FATAL: Python not found. Install Python 3.11+ from python.org"
    exit /b 1
)

REM Get Python version
for /f "tokens=*" %%v in ('"%PYTHON_EXE%" --version 2^>^&1') do set PY_VERSION=%%v
call :log "PYTHON: %PYTHON_EXE% (%PY_VERSION%)"

REM Delete broken venv if it exists
if exist "%VENV_DIR%" (
    call :log "CLEAN: Removing existing venv directory..."
    rmdir /s /q "%VENV_DIR%"
    call :log "CLEAN: Deleted broken venv"
)

REM Create new venv
call :log "CREATING: New venv in %VENV_DIR%..."
"%PYTHON_EXE%" -m venv "%VENV_DIR%" --clear
if not exist "%VENV_DIR%\pyvenv.cfg" (
    call :log "FATAL_VENV: pyvenv.cfg missing after creation"
    exit /b 1
)
call :log "VENV_CREATED: pyvenv.cfg confirmed"

REM Set venv paths
set VENV_PYTHON=%VENV_DIR%\Scripts\python.exe
set VENV_PIP=%VENV_DIR%\Scripts\pip.exe

REM Wait for pip to be available
ping -n 2 127.0.0.1 > nul

REM Upgrade pip
call :log "UPGRADE: Upgrading pip..."
"%VENV_PIP%" install --upgrade pip --quiet --disable-pip-version-check

REM Check requirements file
if not exist "%REQUIREMENTS%" (
    call :log "FATAL: requirements.txt not found: %REQUIREMENTS%"
    exit /b 1
)

REM Install requirements
call :log "INSTALL: Installing packages from requirements.txt"
"%VENV_PIP%" install -r "%REQUIREMENTS%" --quiet --disable-pip-version-check
if errorlevel 1 (
    call :log "INSTALL_FAILED: pip returned error"
    exit /b 2
)
call :log "INSTALL_SUCCESS: All packages installed"

REM Run uvicorn
call :log "STARTING: uvicorn app.main:app --reload"
if not exist "%VENV_DIR%\Scripts\uvicorn.exe" (
    call :log "FATAL: uvicorn not found in venv. Attempting to install..."
    "%VENV_PIP%" install uvicorn[standard] --quiet --disable-pip-version-check
    if errorlevel 1 (
        call :log "UVICORN_INSTALL_FAIL: Could not install uvicorn"
        exit /b 3
    )
    call :log "UVICORN_INSTALLED: Successfully installed uvicorn in venv"
)

REM Start uvicorn server
call :log "UVICORN_RUNNING: Starting server at http://0.0.0.0:8000"
"%VENV_DIR%\Scripts\uvicorn.exe" app.main:app --reload --host 0.0.0.0 --port 8000 --log-level info
if errorlevel 1 (
    call :log "UVICORN_ERROR: Failed to start uvicorn server"
    exit /b 3
)

call :log "SUCCESS: Backend running cleanly."
exit /b 0