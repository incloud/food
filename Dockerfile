FROM gradle:7.5.1-jdk17 as backend-build

WORKDIR /var/app/backend
ENV GRADLE_OPTS="-Dorg.gradle.daemon=false -Dorg.gradle.logging.level=info -Dorg.gradle.parallel=true"
ENV GRADLE_USER_HOME=/tmp/gradle

COPY backend/build.gradle.kts backend/settings.gradle.kts ./
RUN gradle downloadDependencies

COPY backend/src src

# add editorconfig so it can be used with ktlintCheck in CI pipeline
COPY .editorconfig ..

# We first need the GraphQL schema to be able to generate the frontend code based on it
RUN gradle graphqlGenerateSDL

# -----------------------------------------------------

FROM node:19.0.0-alpine3.16 as frontend-build

WORKDIR /var/app/frontend
RUN npm install -g npm@8.10.0

COPY frontend/package.json .
COPY frontend/package-lock.json .

# TODO: Fix
RUN npm ci --force

COPY --from=backend-build /var/app/backend/build/schema.graphql .
COPY frontend/ .

RUN npm run gql-gen && npm run build

# -----------------------------------------------------

FROM backend-build as backend-jar
COPY --from=frontend-build /var/app/frontend/build/ src/main/resources/static/
# Now we can build the Jar again, including the frontend
RUN gradle bootJar

# -----------------------------------------------------

FROM amazoncorretto:17.0.5-alpine3.16
WORKDIR /var/app
COPY --from=backend-jar /var/app/backend/build/libs/food-0.0.1-SNAPSHOT.jar app.jar
USER 2000:2000
CMD ["java", "-jar", "app.jar"]
