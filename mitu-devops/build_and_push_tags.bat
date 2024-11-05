@echo off
setlocal

:: Generate a unique signal name
set SIGNAL=BuildSignal%random%

:: Start backend build and push in the background
start /b cmd /c "(cd .. && docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_backend:latest -f backend.Dockerfile . && waitfor /si %SIGNAL%)"

:: Start frontend build and push in the background
start /b cmd /c "(cd .. && docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_frontend:latest -f frontend.Dockerfile . && waitfor /si %SIGNAL%)"

:: Start prerender build and push in the background
start /b cmd /c "(cd .. && docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_prerender:latest -f prerender.Dockerfile . && waitfor /si %SIGNAL%)"

:: Start frontend build and push in the background
start /b cmd /c "(cd .. && docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_cron:latest -f cron.Dockerfile . && waitfor /si %SIGNAL%)"

:: Wait for both commands to signal completion
waitfor %SIGNAL% /t 3600
waitfor %SIGNAL% /t 3600
waitfor %SIGNAL% /t 3600
waitfor %SIGNAL% /t 3600

echo All 4 Docker builds have been completed.
endlocal
