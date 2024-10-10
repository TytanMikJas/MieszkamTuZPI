@echo off
setlocal

:: Generate a unique signal name
set SIGNAL=BuildSignal%random%

:: Start backend build and push in the background
start /b cmd /c "(cd ../mitu-backend && docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_backend:latest . && waitfor /si %SIGNAL%)"

:: Start frontend build and push in the background
start /b cmd /c "(cd ../mitu-frontend && docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_frontend:latest . && waitfor /si %SIGNAL%)"

:: Start frontend build and push in the background
start /b cmd /c "(cd ../mitu-cron && docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_cron:latest . && waitfor /si %SIGNAL%)"

:: Wait for both commands to signal completion
waitfor %SIGNAL% /t 3600
waitfor %SIGNAL% /t 3600
waitfor %SIGNAL% /t 3600

echo All 3 Docker builds have been completed.
endlocal
