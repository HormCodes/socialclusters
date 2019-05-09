#!/usr/bin/env bash

cd backend
./gradlew clean
./gradlew bootJar

docker build -t socialclusters/backend .

cd ../topic_analysis_service
docker build -t socialclusters/topic_analysis_service .


cd ../platform_api_service
docker build -t socialclusters/platform_api_service .

cd ../frontend
docker build -t socialclusters/frontend .

cd ../docker
docker build -t socialclusters/nginx .

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
