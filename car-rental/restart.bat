@echo off
setlocal

:: ============================================================================
:: Configuration
::
:: Set the port your application runs on.
:: Common ports are 3000 (React), 4200 (Angular), 8080 (Vue), etc.
:: ============================================================================
set PORT=3000


:: --- Script Body (No need to edit below this line) ---

set "URL=http://localhost:%PORT%"

echo.
echo =========================================
echo  Automatic NPM Restart Script
echo =========================================
echo.
echo Searching for any process using port %PORT%...
echo.

:: Find the Process ID (PID) of the application listening on the specified port.
:: The 'for' loop parses the output of 'netstat' to find the PID.
for /f "tokens=5" %%a in ('netstat -ano -p tcp ^| findstr :%PORT%') do (
    set "PID=%%a"
    goto :kill_process
)

echo No existing process found.
goto :start_server

:kill_process
if not defined PID (
    echo No process found to terminate.
    goto :start_server
)
echo Found running process with PID: %PID%.
echo Terminating process...
taskkill /PID %PID% /F
echo.
echo Process terminated successfully.
echo.
:: A small delay to ensure the port is fully released.
timeout /t 2 /nobreak >nul

:start_server
echo Starting the application with "npm start"...
echo.

:: The 'start "Title"' command opens a new command window to run the process.
:: This allows this script to continue without waiting for npm to finish.
start "NPM Server" cmd /c "npm start"

echo Waiting for the server to initialize...
:: This delay gives your application server time to compile and launch.
:: You can increase this value if your app takes longer to start.
timeout /t 8 /nobreak >nul

echo.
echo Opening %URL% in your default browser.
start %URL%

echo.
echo =========================================
echo  Script finished.
echo =========================================
echo.

endlocal
