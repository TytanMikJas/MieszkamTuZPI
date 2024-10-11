# mitu_cron
FROM maven:3.8.3-amazoncorretto-17 AS build
COPY ./mitu-cron .
RUN mvn clean package -DskipTests

FROM amazoncorretto:17-alpine3.17
COPY --from=build target/mitu-cron.jar mitu-cron.jar

ENTRYPOINT java -jar mitu-cron.jar
