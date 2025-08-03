@echo off
echo Installing LaundryHub Dependencies...
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)

echo [3/4] Setup Complete!
echo [4/4] Please configure your environment variables in:
echo   - backend\.env
echo   - frontend\.env
echo.
echo Next steps:
echo 1. Set up MongoDB (local or Atlas)
echo 2. Configure Razorpay keys
echo 3. Run: npm run dev (in both backend and frontend)
echo.
pause
