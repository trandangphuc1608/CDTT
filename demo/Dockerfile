# Giai đoạn 1: Build file .jar
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy ứng dụng
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Lệnh chạy ứng dụng (quan trọng)
ENTRYPOINT ["java", "-jar", "app.jar"]