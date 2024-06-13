@echo off
setlocal

:: Define the Python version, the name of the virtual environment, and the dependencies
set PYTHON_VERSION=3.10.11
set VENV_NAME=venv
set DEPENDENCIES='--upgrade pip' numpy jupyter matplotlib tensorflow==2.16.1 opencv-python mediapipe scikit-learn matplotlib 'keras==3.0'

:: Check if Python is already installed
javac -version >nul 2>&1 && (
    echo Python is installed
) || (

    :: Download Python
    echo installing Python3.10
    powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/%PYTHON_VERSION%/python-%PYTHON_VERSION%-amd64.exe -OutFile python-%PYTHON_VERSION%-amd64.exe"

    :: Install Python
    start /wait python-%PYTHON_VERSION%-amd64.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

    del python-%PYTHON_VERSION%-amd64.exe
)

:: Create the virtual environment
python3.10 -m venv %VENV_NAME%

:: upgrade pip
%VENV_NAME%\Scripts\python -m pip install --upgrade pip

:: Install the dependencies
for /F "delims=" %%d in (requirements.txt) do (
    %VENV_NAME%\Scripts\pip install %%d
)

endlocal