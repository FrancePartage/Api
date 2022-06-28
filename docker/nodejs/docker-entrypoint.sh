#!/bin/sh

echo "Generating prisma..."
npx prisma generate

echo "Deploying prisma..."
npx prisma migrate deploy

echo "Building..."
npm run build

exec "$@"
