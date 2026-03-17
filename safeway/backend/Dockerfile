# 1. 빌드 단계
FROM gradle:8-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle clean build -x test --no-daemon

# 2. 런타임 단계
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]