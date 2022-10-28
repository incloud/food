package de.incloud.food

import de.incloud.food.fixtures.FixtureLoader
import de.incloud.food.model.Site
import de.incloud.food.model.SiteRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.WebApplicationType
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import kotlin.system.exitProcess

@SpringBootApplication
class Application(
  val fixtureLoader: FixtureLoader,
  val siteRepository: SiteRepository,
) : CommandLineRunner {
  override fun run(args: Array<String>) {
    if (args.isNotEmpty()) {
      when (args[0]) {
        "fixtures:load" -> fixtureLoader.load()
        "site:add" -> {
          if (args.size > 1) {
            siteRepository.save(Site(args[1]))
          } else {
            System.err.println("Specify the site name!")
            exitProcess(1)
          }
        }
        else -> {
          System.err.println("Unknown option!")
          exitProcess(1)
        }
      }

      exitProcess(0)
    }
  }
}

fun main(args: Array<String>) {
  // We want to disable serving the web application when console commands are supplied
  var web = WebApplicationType.REACTIVE
  if (args.isNotEmpty()) {
    web = WebApplicationType.NONE
  }

  SpringApplicationBuilder(Application::class.java)
    .web(web)
    .run(*args)
}
