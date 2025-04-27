# Step 1: Base Image for Java 17
FROM openjdk:17-jdk-slim as backend-builder

# Set working directory
WORKDIR /app

# Step 2: Install necessary dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Step 3: Install Gradle
RUN wget https://services.gradle.org/distributions/gradle-8.13-bin.zip \
    && unzip gradle-8.13-bin.zip \
    && mv gradle-8.13 /opt/gradle \
    && ln -s /opt/gradle/bin/gradle /usr/local/bin/gradle \
    && gradle --version  # Verify Gradle installation

# Step 4: Copy project files
COPY . .

# Step 5: Build the project with Gradle
RUN gradle clean build -x test --stacktrace

# Step 6: Runtime image for the Spring Boot application
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Step 7: Copy the built JAR from the previous step
COPY --from=backend-builder /app/build/libs/*.jar /app/app.jar

EXPOSE 8080

# Step 9: Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
