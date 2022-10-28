import com.expediagroup.graphql.plugin.gradle.graphql
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "2.7.5"
  id("io.spring.dependency-management") version "1.0.15.RELEASE"
  id("org.liquibase.gradle") version "2.1.1"

  val kotlinVersion = "1.7.20"
  kotlin("jvm") version kotlinVersion
  kotlin("plugin.spring") version kotlinVersion
  kotlin("plugin.allopen") version kotlinVersion
  kotlin("plugin.jpa") version kotlinVersion
  kotlin("plugin.serialization") version kotlinVersion

  id("com.expediagroup.graphql") version "6.0.0-alpha.4"
  id("org.jlleitschuh.gradle.ktlint") version "10.3.0"
}

group = "de.incloud"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
  mavenCentral()
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-mail")

  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.security:spring-security-test")

  developmentOnly("org.springframework.boot:spring-boot-devtools")

  implementation("org.apache.logging.log4j:log4j-api-kotlin:1.2.0")
  implementation("org.mariadb.jdbc:mariadb-java-client:3.0.6")
  implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.4.1")

  val graphQlKotlinVersion = "6.2.5"
  implementation("com.expediagroup", "graphql-kotlin-spring-server", graphQlKotlinVersion)
  implementation("com.expediagroup", "graphql-kotlin-hooks-provider", graphQlKotlinVersion)
  implementation("com.graphql-java:graphql-java-extended-scalars:19.0")

  // Liquibase
  implementation("org.liquibase:liquibase-core:4.17.0")
  liquibaseRuntime("org.liquibase:liquibase-groovy-dsl:3.0.2")
  liquibaseRuntime("org.mariadb.jdbc:mariadb-java-client")
  liquibaseRuntime("org.liquibase.ext:liquibase-hibernate5:4.17.0")
  liquibaseRuntime("info.picocli:picocli:4.6.3")
  liquibaseRuntime(sourceSets.getByName("main").compileClasspath)
  liquibaseRuntime(sourceSets.getByName("main").runtimeClasspath)
  liquibaseRuntime(sourceSets.getByName("main").output)
}

tasks.withType<Test> {
  useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs = listOf("-Xjsr305=strict")
    jvmTarget = "17"
  }
}

// tasks.withType<org.springframework.boot.gradle.tasks.run.BootRun> {
//   jvmArgs = listOf("-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005")
// }

configurations {
  liquibase {
    activities.register("main")
    runList = "main"
  }
}

fun Configuration.isDeprecated() =
  this is org.gradle.internal.deprecation.DeprecatableConfiguration && resolutionAlternatives != null
tasks.register("downloadDependencies") {
  doLast {
    configurations
      .filter { it.isCanBeResolved && !it.isDeprecated() }
      .forEach { it.resolve() }
  }
}

// https://spring.io/guides/tutorials/spring-boot-kotlin/
allOpen {
  annotation("javax.persistence.Entity")
  annotation("javax.persistence.Embeddable")
  annotation("javax.persistence.MappedSuperclass")
}

graphql {
  schema {
    packages = listOf("de.incloud.food")
  }
}
