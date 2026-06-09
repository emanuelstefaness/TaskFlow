@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0rodar.ps1"
pause
