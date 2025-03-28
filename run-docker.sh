#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file from .env.local..."
  if [ -f .env.local ]; then
    cp .env.local .env
  else
    echo "Error: No .env.local file found. Please create one with your Supabase credentials."
    exit 1
  fi
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t maya-inventory-manager .

# Run the Docker container
echo "Starting Docker container..."
docker-compose up -d

echo "Maya Inventory Manager is running at http://localhost:3000" 