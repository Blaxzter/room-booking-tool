#!/bin/bash

set -e

# Variables
REPO_FRONTEND="blaxzter/bookitool-frontend"
REPO_DIRECTUS="blaxzter/bookitool-directus"
REPO_TELEGRAM="blaxzter/bookitool-telegram-bot"
DOCKERFILE_DIRECTUS="Dockerfile.directus"
DOCKERFILE_FRONTEND="Dockerfile.frontend"
DOCKERFILE_TELEGRAM="Dockerfile"

VERSION_FILE="src/version.ts"

# Ensure version.ts file exists
if [ ! -f "$VERSION_FILE" ]; then
  echo "version.ts file not found!"
  exit 1
fi

# Read and increment the version from version.js
VERSION=$(grep 'export const version =' $VERSION_FILE | awk -F"'" '{print $2}')
IFS='.' read -r -a VERSION_PARTS <<< "$VERSION"
NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.$((VERSION_PARTS[2] + 1))"

## Build and push directus image
#docker build -t $REPO_DIRECTUS:$VERSION -f $DOCKERFILE_DIRECTUS .
#docker tag $REPO_DIRECTUS:$VERSION $REPO_DIRECTUS:latest
#docker push $REPO_DIRECTUS:$VERSION
#docker push $REPO_DIRECTUS:latest

# Build and push frontend image
docker build -t $REPO_FRONTEND:$VERSION -f $DOCKERFILE_FRONTEND .
docker tag $REPO_FRONTEND:$VERSION $REPO_FRONTEND:latest
docker push $REPO_FRONTEND:$VERSION
docker push $REPO_FRONTEND:latest

# Build and push telegram image
#cd telegram-bot
#docker build -t $REPO_TELEGRAM:$VERSION -f $DOCKERFILE_TELEGRAM .
#docker tag $REPO_TELEGRAM:$VERSION $REPO_TELEGRAM:latest
#docker push $REPO_TELEGRAM:$VERSION
#docker push $REPO_TELEGRAM:latest
#cd ..

# Update the version in version.js
#sed -i "s/export const version = '$VERSION'/export const version = '$NEW_VERSION'/" $VERSION_FILE

# Commit and push the new version to git
#git config --global user.name "Frederic Marvin Abraham"
#git config --global user.email "mail@fabraham.dev"
#git add $VERSION_FILE
#git commit -m "Bump version to $NEW_VERSION"
#git push origin main
#
#echo "Deployed version $VERSION"
#echo "Build, push, and version update completed successfully!"
