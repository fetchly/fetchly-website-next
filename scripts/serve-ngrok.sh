#!/usr/bin/env bash
set -e

PORT="${PORT:-3000}"

echo "Building Next.js app..."
npm run build

echo "Starting Next.js on port $PORT..."
npm run start -- -p "$PORT" &
NEXT_PID=$!

# Wait for the server to be ready
echo "Waiting for server to start..."
until curl -s "http://localhost:$PORT" > /dev/null 2>&1; do
  sleep 1
done

echo "Starting ngrok tunnel on port $PORT..."
ngrok http "$PORT"

# Clean up when ngrok exits
kill $NEXT_PID 2>/dev/null
