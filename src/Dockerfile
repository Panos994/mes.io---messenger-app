# Στάδιο Build: Χρησιμοποιούμε μια εικόνα με Maven και Java για να χτίσουμε το project
FROM maven:3.9.6-eclipse-temurin-17 AS build
# (Αντικαταστήστε το 17 με 21 αν χρειάζεται)

# Ρυθμίζουμε τον φάκελο εργασίας μέσα στο container
WORKDIR /app

# Αντιγράφουμε το pom.xml για να γίνει το download των dependencies
COPY pom.xml .

# Κατεβάζουμε τις εξαρτήσεις (dependencies)
RUN mvn dependency:go-offline

# Αντιγράφουμε όλο τον κώδικα
COPY src ./src

# Εκτελούμε το build
RUN mvn clean install -DskipTests

# -------------------------------------------------------------------

# Στάδιο Πακέτου: Χρησιμοποιούμε μια μικρότερη εικόνα μόνο με το JRE για να τρέξει η εφαρμογή
FROM eclipse-temurin:17-jre-alpine

# Ορίζουμε τη θύρα στην οποία ακούει η εφαρμογή (default Spring Boot)
ENV PORT 8080
EXPOSE 8080

# Αντιγράφουμε το JAR αρχείο που χτίστηκε στο στάδιο build
COPY --from=build /app/target/*.jar app.jar

# Εντολή για την εκκίνηση της εφαρμογής
ENTRYPOINT ["java", "-jar", "/app.jar"]