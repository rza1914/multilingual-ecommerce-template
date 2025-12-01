# dummy_jwt_test.ps1 - Generate dummy JWT for WS test
Set-Location $PSScriptRoot\backend

Write-Host "Generating dummy JWT..." -ForegroundColor Yellow
python -c "from jose import jwt; from app.core.config import settings; payload = {'sub': '1', 'exp': 9999999999}; token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM); print(token)"