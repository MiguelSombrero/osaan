FROM openjdk:25-jdk
WORKDIR /application
COPY ./target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]