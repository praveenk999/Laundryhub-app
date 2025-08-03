@echo off
echo Starting LaundryHub Application...
echo.

echo [1/2] Starting Backend Server...
start "LaundryHub Backend" cmd /k "cd backend && npm run server"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Development Server...
start "LaundryHub Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo LaundryHub is starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
