#!/bin/sh

# Wait for the database to be ready
echo "Waiting for PostgreSQL to start..."
sleep 5

# Check the environment and execute the appropriate database setup
if [ "$APP_ENV" = "production" ]; then
  echo "Production environment detected - running Prisma migrations..."
  pnpm dlx prisma migrate deploy
else
  echo "Development environment detected - running Prisma db push..."
  pnpm dlx prisma db push
fi

# Start the application
echo "Starting the application..."
cd /app
exec node dist/main
