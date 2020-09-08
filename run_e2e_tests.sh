#!/bin/bash

# The NestJS app is dependant on two databases: MongoDB and Eventstore. While MongoDB has a nice in-memory npm package
# for testing, there is no such thing for Eventstore. Therefore the next best thing is just lifting the whole stack 
# using Docker compose and running the tests against a real db.

# Build production image, which will serve as base for the testing container
docker-compose build registry-backend
# Build testing container
docker-compose -f docker-compose.test.yml -p ci build

# Run the testing setup. The entrypoint of the testing container starts the test suite automatically.
docker-compose -f docker-compose.test.yml -p ci up -d
docker logs -f ci_registry-backend_1

# Wait until the tests have finished
status_code="$(docker wait ci_registry-backend_1)"

# Stop and clean up de containers
docker-compose -f docker-compose.test.yml -p ci down

# For now, simply echo the status (0 = successful, 1 = unsuccessful). Can be used for CI purposes.
echo "Status code of last run command: ${status_code}"
