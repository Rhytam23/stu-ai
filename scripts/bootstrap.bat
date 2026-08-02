@echo off
rem CMD execution bridge running PowerShell bootstrap.ps1 script

powershell.exe -ExecutionPolicy Bypass -File "%~dp0\bootstrap.ps1" %*
