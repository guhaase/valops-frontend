#!/bin/bash
# Custom build script that removes the treinamentos folder from public before building
# This is a workaround for the hard-coded path issue

# Create a backup of public/treinamentos
if [ -d "public/treinamentos" ]; then
  echo "Backing up public/treinamentos directory..."
  mv public/treinamentos public/treinamentos.bak
fi

# Run the build
echo "Running build without treinamentos directory..."
SKIP_PREFLIGHT_CHECK=true react-scripts build

# Restore the treinamentos directory
if [ -d "public/treinamentos.bak" ]; then
  echo "Restoring public/treinamentos directory..."
  mv public/treinamentos.bak public/treinamentos
fi

echo "Build completed"