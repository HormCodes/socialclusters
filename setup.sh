#!/usr/bin/env bash

cd docker
docker-compose up -d

cd ../backend
./gradlew clean
./gradlew bootJar

docker build --no-cache -t socialclusters/backend .

cd ../topic_analysis_service
docker build --no-cache -t socialclusters/topic_analysis_service .


cd ../platform_api_service
docker build --no-cache -t socialclusters/platform_api_service .

cd ../frontend
docker build --no-cache -t socialclusters/frontend .

cd ../nginx
docker build --no-cache -t socialclusters/nginx .

cd ../docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
