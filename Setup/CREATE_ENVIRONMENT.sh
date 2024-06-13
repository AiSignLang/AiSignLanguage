#!/bin/bash
PYTHON_VERSION="3.10.11"
VENV_NAME=".venv"

if command -v python3.10 >/dev/null 2>&1; then
    echo "python3.10 is installed."
else
    # Download Python
    wget https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tgz
    tar -xvf Python-$PYTHON_VERSION.tgz

    cd Python-$PYTHON_VERSION

    # Configure and install Python
    ./configure
    make
    sudo make install

    # Go back to the previous directory
    cd ..
    rm -r Python-$PYTHON_VERSION.tgz Python-$PYTHON_VERSION
fi

# Create the virtual environment
python3.10 -m venv $VENV_NAME

# Activate the virtual environment
source $VENV_NAME/bin/activate

# Update pip
python -m pip install --upgrade pip

# Install the dependencies
while read dep; do
    pip install $dep
done < requirements.txt

# Deactivate the virtual environment
deactivate