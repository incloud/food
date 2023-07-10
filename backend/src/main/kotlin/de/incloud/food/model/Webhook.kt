package de.incloud.food.model

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne

@Entity
class Webhook(
  @Column(nullable = false)
  var name: String,

  @Column(nullable = false, length = 1500)
  var url: String,

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(updatable = false, nullable = false)
  val site: Site,
) : Node()

interface WebhookRepository : JpaRepository<Webhook, UUID>
