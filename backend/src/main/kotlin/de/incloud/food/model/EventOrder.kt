package de.incloud.food.model

import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne

@Entity
data class EventOrder(
  var text: String,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(updatable = false, nullable = false)
  val event: Event,

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(updatable = false, nullable = false)
  val createdBy: User,

  @Column(updatable = false, nullable = false)
  val createdAt: Long = Instant.now().epochSecond,

  @Column(nullable = false)
  var availableForLottery: Boolean = true
) : Node() {
  var updatedAt: Long? = null
}

interface EventOrderRepository : JpaRepository<EventOrder, UUID> {
  fun findByUuidAndCreatedBy(uuid: UUID, createdBy: User): EventOrder?
}
