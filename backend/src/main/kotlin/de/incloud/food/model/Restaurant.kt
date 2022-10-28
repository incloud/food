package de.incloud.food.model

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany

@Entity
class Restaurant(
  @Column(nullable = false)
  var name: String,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(updatable = false, nullable = false)
  val createdBy: User,

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(updatable = false, nullable = false)
  val site: Site,

  var address: String? = null,
  var phone: String? = null,
  var website: String? = null,
  var delivery: Boolean = true,
  var comment: String? = null,

  @Column(updatable = false, nullable = false)
  val createdAt: Long = Instant.now().epochSecond,
) : Node() {
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "restaurant")
  val events = mutableListOf<Event>()

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = true)
  var updatedBy: User? = null

  var updatedAt: Long? = null
  var deleted = false
}

interface RestaurantRepository : JpaRepository<Restaurant, UUID> {
  fun findByNameContains(name: String, pageable: Pageable): Page<Restaurant>
}
