#!/bin/bash

set -e

# Variables
REPO_FRONTEND="blaxzter/bookitool-frontend"
REPO_DIRECTUS="blaxzter/bookitool-directus"
DOCKERFILE_DIRECTUS="Dockerfile.directus"
DOCKERFILE_FRONTEND="Dockerfile.frontend"
PACKAGE_JSON="package.json"

# Ensure package.json file exists
if [ ! -f "$PACKAGE_JSON" ]; then
  echo "package.json file not found!"
  exit 1
fi

# Read and increment the version from package.json
VERSION=$(jq -r '.version' $PACKAGE_JSON)
IFS='.' read -r -a VERSION_PARTS <<< "$VERSION"
NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.$((VERSION_PARTS[2] + 1))"

# Build and push directus image
docker build -t $REPO_DIRECTUS:$VERSION -f $DOCKERFILE_DIRECTUS .
docker tag $REPO_DIRECTUS:$VERSION $REPO_DIRECTUS:latest
docker push $REPO_DIRECTUS:$VERSION
docker push $REPO_DIRECTUS:latest

# Build and push frontend image
docker build -t $REPO_FRONTEND:$VERSION -f $DOCKERFILE_FRONTEND .
docker tag $REPO_FRONTEND:$VERSION $REPO_FRONTEND:latest
docker push $REPO_FRONTEND:$VERSION
docker push $REPO_FRONTEND:latest

# Update the version in package.json
jq ".version = \"$NEW_VERSION\"" $PACKAGE_JSON > tmp.$$.json && mv tmp.$$.json $PACKAGE_JSON

# Commit and push the new version to git
git config --global user.name "Frederic Marvin Abraham"
git config --global user.email "mail@fabraham.dev"
git add $PACKAGE_JSON
git commit -m "Bump version to $NEW_VERSION"
git push origin main

echo "Build, push, and version update completed successfully!"
