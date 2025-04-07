#!/bin/bash

# Exit on error
set -e

# Get the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Build the project
echo "Building project..."
npm run build

# Configure Git for GitHub Pages
echo "Configuring Git for GitHub Pages..."
git config --global user.email "github-actions@github.com"
git config --global user.name "GitHub Actions"

# Create a temporary directory for the deployment
echo "Setting up deployment..."
TEMP_DIR=$(mktemp -d)
git clone --branch gh-pages --depth 1 https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git $TEMP_DIR

# Copy the built files to the temporary directory
echo "Copying built files..."
cp -r docs/* $TEMP_DIR/

# Create a .nojekyll file to bypass Jekyll processing
touch $TEMP_DIR/.nojekyll

# Commit and push the changes
echo "Committing and pushing changes..."
cd $TEMP_DIR
git add .
git commit -m "Deploy to GitHub Pages: $(date)"
git push origin gh-pages

# Clean up
echo "Cleaning up..."
cd -
rm -rf $TEMP_DIR

echo "Deployment complete!" 