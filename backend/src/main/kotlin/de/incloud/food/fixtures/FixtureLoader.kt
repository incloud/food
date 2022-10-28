package de.incloud.food.fixtures

import org.springframework.stereotype.Component

@Component
class FixtureLoader(
  private val userFixtures: UserFixtures,
  private val siteFixtures: SiteFixtures,
  private val restaurantFixtures: RestaurantFixtures,
  private val eventFixtures: EventFixtures,
) {
  fun load() {
    userFixtures.load()
    siteFixtures.load()
    restaurantFixtures.load()
    eventFixtures.load()
    println("Fixtures loaded successfully!")
  }
}
