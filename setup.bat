@echo off
rem setup.bat
rem Wrapper redirecting to scripts/bootstrap.bat for backward compatibility
call "%~dp0\scripts\bootstrap.bat" %*
