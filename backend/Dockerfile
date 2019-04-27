FROM openjdk:8-jdk-alpine
VOLUME /tmp
COPY build/libs/*.jar backend.jar
ENTRYPOINT ["java","-jar","/backend.jar"]
