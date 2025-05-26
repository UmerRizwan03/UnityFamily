@echo off
set "PATH=%ProgramFiles%\nodejs\;%APPDATA%\npm\;%PATH%"
set "NODE_PATH=%ProgramFiles%\nodejs\node_modules"
cd "%~dp0"
"%ProgramFiles%\nodejs\npm.cmd" start
pause