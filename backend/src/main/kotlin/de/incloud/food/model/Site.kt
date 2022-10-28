package de.incloud.food.model

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.OneToMany

@Entity
class Site(
  @Column(nullable = false)
  var name: String,
) : Node() {
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "site")
  val restaurants = mutableListOf<Restaurant>()

  var teamsWebhookUrl: String? = null
}

interface SiteRepository : JpaRepository<Site, UUID>
