#!/bin/bash

# Generate a unique signal name
SIGNAL=BuildSignal$$

# Start backend build and push in the background
(
  cd .. || exit
  docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_backend:latest -f backend.Dockerfile  .
  touch "/tmp/$SIGNAL-backend"
) &

# Start frontend build and push in the background
(
  cd .. || exit
  docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_frontend:latest -f frontend.Dockerfile  .
  touch "/tmp/$SIGNAL-frontend"
) &

# Start cron build and push in the background
(
  cd .. || exit
  docker build -t registry.gitlab.com/mieszamtu/mieszkamtuzpi/mitu_cron:latest -f cron.Dockerfile .
  touch "/tmp/$SIGNAL-cron"
) &

# Wait for the signals from all background processes
while [ ! -f "/tmp/$SIGNAL-backend" ] || [ ! -f "/tmp/$SIGNAL-frontend" ] || [ ! -f "/tmp/$SIGNAL-cron" ]; do
  sleep 1
done

# Clean up
rm "/tmp/$SIGNAL-backend" "/tmp/$SIGNAL-frontend" "/tmp/$SIGNAL-cron"

echo "All 3 Docker builds have been completed."
