#!/bin/sh

if [ $MIGRATE_DATABASE -eq 1 ]; then
  echo "Generating prisma..."
  npx prisma generate

  echo "Deploying prisma..."
  npx prisma migrate deploy

  echo "Building..."
  npm run build
fi

exec "$@"
