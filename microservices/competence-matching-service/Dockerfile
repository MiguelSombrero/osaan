FROM eclipse-temurin:25-jdk-alpine-3.22
WORKDIR /application
COPY ./target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]