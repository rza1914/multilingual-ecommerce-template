@echo off
cd frontend
echo Installing i18n dependencies...
call npm install react-i18next i18next i18next-browser-languagedetector
echo Creating i18n directories...
if not exist "src\i18n" mkdir "src\i18n"
if not exist "src\i18n\locales" mkdir "src\i18n\locales"
echo Done!
pause
