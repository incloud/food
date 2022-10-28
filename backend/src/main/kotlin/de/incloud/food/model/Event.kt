package de.incloud.food.model

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI
import java.time.Instant
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany

@Entity
data class Event(
  var name: String,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  var restaurant: Restaurant,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(updatable = false, nullable = false)
  val createdBy: User,

  @Column(updatable = false, nullable = false)
  val createdAt: Long = Instant.now().epochSecond,
) : Node() {
  @ManyToOne(fetch = FetchType.LAZY)
  var updatedBy: User? = null

  @ManyToOne(fetch = FetchType.LAZY)
  var lotteryWinner: User? = null

  var active: Boolean = true
  var updatedAt: Long? = null
  var description: String? = null

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "event")
  val orders = mutableListOf<EventOrder>()

  @GraphQLIgnore
  fun url(baseUrl: URI): String {
    return UriComponentsBuilder.fromUri(baseUrl)
      .replacePath("/events/$uuid")
      .build()
      .toUriString()
  }
}

interface EventRepository : JpaRepository<Event, UUID>
