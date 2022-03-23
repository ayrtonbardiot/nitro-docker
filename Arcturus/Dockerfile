FROM maven:3.8.4-openjdk-8-slim AS builder

COPY . /emulator/

WORKDIR /emulator/

RUN mvn clean package && mv /emulator/target/Habbo*-with-dependencies.jar /emulator/target/Habbo.jar

FROM openjdk:8u322-jre-slim AS runner

COPY --from=builder /emulator/target/Habbo.jar /emulator/config.ini /

ENTRYPOINT exec java $JAVA_OPTS -jar Habbo.jar