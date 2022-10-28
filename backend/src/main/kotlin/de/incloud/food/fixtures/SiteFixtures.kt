package de.incloud.food.fixtures

import de.incloud.food.model.Site
import de.incloud.food.model.SiteRepository
import org.springframework.stereotype.Component

@Component
class SiteFixtures(
  private val repository: SiteRepository
) {
  companion object {
    val darmstadt = Site("Darmstadt")
    val hamburg = Site("Hamburg")
    val cologne = Site("Köln")

    val sites = listOf(
      darmstadt,
      hamburg,
      cologne,
    )
  }

  fun load() {
    repository.saveAll(sites)
  }
}
