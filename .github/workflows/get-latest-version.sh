#!/bin/bash

# Set your Docker Hub username and the name of your image
DOCKER_HUB_USERNAME="ital3x"
DOCKER_IMAGE_NAME=$1

# Get the JSON response from Docker Hub
JSON_RESPONSE=$(curl -s "https://hub.docker.com/v2/namespaces/${DOCKER_HUB_USERNAME}/repositories/${DOCKER_IMAGE_NAME}/tags")

apt update
apt install jq -y
apt install awk -y

# Parse the JSON response to get the "name" field
VERSIONS=$(echo "$JSON_RESPONSE" | jq -r '.results[].name')

# Filter out versions that don't match the semantic versioning format
SEMVER_REGEX="^[0-9]+\.[0-9]+\.[0-9]+$"
SEMVER_VERSIONS=()
for VERSION in $VERSIONS; do
    if [[ $VERSION =~ $SEMVER_REGEX ]]; then
        SEMVER_VERSIONS+=($VERSION)
    fi
done

# Sort the versions and select the highest one
HIGHEST_VERSION=$(printf '%s\n' "${SEMVER_VERSIONS[@]}" | sort -V | tail -n1)

# Extract the major, minor, and patch versions
MAJOR_VERSION=$(echo "$HIGHEST_VERSION" | awk -F. '{print $1}')
MINOR_VERSION=$(echo "$HIGHEST_VERSION" | awk -F. '{print $2}')
PATCH_VERSION=$(echo "$HIGHEST_VERSION" | awk -F. '{print $3}')

# Increment the patch version
NEW_VERSION="$MAJOR_VERSION.$MINOR_VERSION.$((PATCH_VERSION + 1))"

echo "NEW_VERSION=$NEW_VERSION" >> $GITHUB_ENV
echo "NEW_VERSION=$NEW_VERSION"