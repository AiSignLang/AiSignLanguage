#!/bin/bash

# Define the Python version, the name of the virtual environment, and the dependencies
PYTHON_VERSION="3.10.11"
VENV_NAME=".venv"
DEPENDENCIES="numpy jupyter matplotlib tensorflow==2.16.1 opencv-python mediapipe scikit-learn matplotlib keras==3.0"

# Download Python
wget https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tgz

# Extract the downloaded file
tar -xvf Python-$PYTHON_VERSION.tgz

# Go to the Python directory
cd Python-$PYTHON_VERSION

# Configure and install Python
./configure
make
sudo make install

# Go back to the previous directory
cd ..

# Create the virtual environment
python3.10 -m venv $VENV_NAME

# Activate the virtual environment
source $VENV_NAME/bin/activate

# Install the dependencies
for dep in $DEPENDENCIES; do
    pip install $dep
done

# Deactivate the virtual environment
deactivate