#!/bin/bash

# Set your Docker Hub username and the name of your image
DOCKER_HUB_USERNAME="ital3x"
DOCKER_IMAGE_NAME=$1

# Get the JSON response from Docker Hub
JSON_RESPONSE=$(curl -s "https://hub.docker.com/v2/namespaces/${DOCKER_HUB_USERNAME}/repositories/${DOCKER_IMAGE_NAME}/tags")

apt update
apt install jq
apt install awk

# Parse the JSON response to get the "name" field
VERSION=$(echo "$JSON_RESPONSE" | jq -r '.results[0].name')

# Split the "name" field by the "." character and get the last number
LAST_NUMBER=$(echo "$VERSION" | awk -F. '{print $NF}')

# Increment the last number
NEW_VERSION=$((LAST_NUMBER + 1))

echo "NEW_VERSION=$NEW_VERSION" >> $GITHUB_ENV
echo "NEW_VERSION=$NEW_VERSION"

