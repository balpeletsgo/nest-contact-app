#!/bin/zsh

echo "Cleaning up Docker environment..."
docker-compose down

echo "Building and starting containers with improved configuration..."
docker-compose build --no-cache
docker-compose up -d

echo "Checking container status..."
docker-compose ps

echo "Viewing logs from the app container..."
docker-compose logs -f app
