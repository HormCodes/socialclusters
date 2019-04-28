#!/usr/bin/env bash

cd backend
./gradlew clean
./gradlew bootJar

docker build -t socialclusters/backend .

cd ../ml_backend
docker build -t socialclusters/ml_backend .

cd ../frontend
docker build -t socialclusters/frontend .

cd ../docker
docker build -t socialclusters/nginx .

docker-compose up -d
