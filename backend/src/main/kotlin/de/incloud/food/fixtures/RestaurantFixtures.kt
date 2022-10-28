package de.incloud.food.fixtures

import de.incloud.food.model.Restaurant
import de.incloud.food.model.RestaurantRepository
import org.springframework.stereotype.Component

@Component
class RestaurantFixtures(
  private val repository: RestaurantRepository
) {
  companion object {
    val restaurants = listOf(
      Restaurant("Nazar Center", UserFixtures.users.random(), SiteFixtures.darmstadt, delivery = false),
      Restaurant("Heimweh", UserFixtures.users.random(), SiteFixtures.darmstadt, delivery = false),
      Restaurant("Danny's Burger & Grill", UserFixtures.users.random(), SiteFixtures.darmstadt),
      Restaurant(
        name = "Latino",
        createdBy = UserFixtures.users.random(),
        site = SiteFixtures.darmstadt,
        address =
        """
          Otto-Röhm-Str. 28
          64293 Darmstadt
        """.trimIndent(),
        phone = "06151 29 30 60",
        website = "https://latinopizza.de/",
      ),
      Restaurant(
        name = "Frittenwerk",
        createdBy = UserFixtures.users.random(),
        site = SiteFixtures.hamburg,
        address =
        """
          Bergstrasse 17
          20095 Hamburg
        """.trimIndent(),
        phone = "040 76758092",
        website = "https://www.frittenwerk.com/",
      ),
      Restaurant(
        name = "Bunny´s Baguette",
        createdBy = UserFixtures.users.random(),
        site = SiteFixtures.cologne,
        address =
        """
          Friesenwall 120
          50672 Köln
        """.trimIndent(),
        phone = "0221 67816438",
        website = "https://www.bunnys-baguette.de/",
        delivery = false,
      ),
    )
  }

  fun load() {
    repository.saveAll(restaurants)
  }
}
